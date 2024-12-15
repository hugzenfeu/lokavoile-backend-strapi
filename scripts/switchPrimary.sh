#!/bin/bash

# Load environment variables
set -a
source .env
set +a

if [ -z "$LOCAL_BACKUP_DIR" ] ; then 
  echo "Error: Required environment variables are not set. Are you sure you have a .env file in this directory?"
  exit 1
fi


# Find the latest backup file based on its timestamp
LATEST_BACKUP=$(ls -t ${LOCAL_BACKUP_DIR}/*.tar.gz 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "Error: No backup files found in ${LOCAL_BACKUP_DIR}."
  exit 1
fi

echo "Restoring from latest backup: $LATEST_BACKUP"

# Build the admin panel
npm run build 

# Restore the Strapi data using the latest backup file
npm run strapi import -- --file "$LATEST_BACKUP" --force

# Start Strapi with PM2
pm2 start strapi