#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M-%S")


# Load environment variables and run the script
set -a
source .env
set +a

# Check if required environment variables are set
if [ -z "$BACKUP_DIR" ] || [ -z "$DYNHOST_SUBDOMAIN" ] || [ -z "$ROOT_DIR" ] || [ -z "$BACKUP_SSH_HOST" ] || [ -z "$BACKUP_SSH_PORT"] || [ -z "$BACKUP_SSH_USER" ]; then 
  echo "Error: Required environment variables are not set."
  echo "Please ensure that BACKUP_DIR and DYNHOST_SUBDOMAIN are defined in the .env file."
  exit 1
fi

cd $ROOT_DIR
HOSTNAME=$(hostname)

npm run strapi export -- --file "/tmp/${DATE}${DYNHOST_SUBDOMAIN}${HOSTNAME}" --no-encrypt
scp -P $BACKUP_SSH_PORT -i $BACKUP_SSH_KEY /tmp/${DATE}${DYNHOST_SUBDOMAIN}${HOSTNAME}.tar.gz $BACKUP_SSH_USER@$BACKUP_SSH_HOST:${BACKUP_DIR}${DATE}${DYNHOST_SUBDOMAIN}${HOSTNAME}.tar.gz 
# Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Backup created successfully: ${BACKUP_DIR}${DATE}${DYNHOST_SUBDOMAIN}${HOSTNAME}.tar.gz"
else
  echo "Error: Backup failed."
  exit 1
fi

# Delete backups older than 2 months (60 days)
ssh -p $BACKUP_SSH_PORT -i $BACKUP_SSH_KEY $BACKUP_SSH_USER@$BACKUP_SSH_HOST "find ${BACKUP_DIR} -type f -name *.tar.gz -mtime +10 -delete ;"

# Check if old backups were deleted successfully
if [ $? -eq 0 ]; then
  echo "Old backups older than 10 days have been deleted successfully."
else
  echo "Error: Failed to delete old backups."
  exit 1
fi
