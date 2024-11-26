#!/bin/bash

# Load environment variables from .env file
set -o allexport
if [ -f .env ]; then
    source .env
else
    echo "$(date): Error - .env file not found. Exiting."
    exit 1
fi
set +o allexport

# Validate required variables
if [[ -z "$DYNHOST_USER" || -z "$DYNHOST_PASSWORD" || -z "$DYNHOST_SUBDOMAIN" ]]; then
    echo "$(date): Error - Missing required environment variables. Check .env file."
    exit 1
fi

# Fetch current public IP
CURRENT_IP=$(curl -s https://ipinfo.io/ip)

# Check the current IP of the DynHost
EXISTING_IP=$(dig +short $DYNHOST_SUBDOMAIN | grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}')

# Check if the fetched IP is valid
if [[ -z "$EXISTING_IP" ]]; then
    echo "$(date): Error - Could not fetch existing IP for $DYNHOST_SUBDOMAIN. Check your DNS settings."
    exit 1
fi

# Update the DynHost record only if the IP has changed
if [ "$CURRENT_IP" != "$EXISTING_IP" ]; then
    echo "Updating DynHost IP from $EXISTING_IP to $CURRENT_IP"
    RESPONSE=$(curl -s -u "$DYNHOST_USER:$DYNHOST_PASSWORD" \
        "https://dns.eu.ovhapis.com/nic/update?system=dyndns&hostname=$DYNHOST_SUBDOMAIN&myip=$CURRENT_IP")

    # Log the response and handle cases
    if [[ $RESPONSE == good* ]]; then
        echo "$(date): Successfully updated DynHost to $CURRENT_IP"
    elif [[ $RESPONSE == nochg* ]]; then
        echo "$(date): IP address $CURRENT_IP is already set. No update needed."
    else
        echo "$(date): Failed to update DynHost. Response: $RESPONSE"
    fi
else
    echo "$(date): IP has not changed. Current IP is $EXISTING_IP"
fi
