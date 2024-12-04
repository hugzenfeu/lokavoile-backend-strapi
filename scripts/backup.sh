#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M-%S")

cd ..
# Load environment variables and run the script
set -a            
source .env
set +a

# Check if required environment variables are set
if [ -z "$BACKUP_DIR" ] || [ -z "$DYNHOST_SUBDOMAIN" ]; then
  echo "Error: Required environment variables are not set."
  echo "Please ensure that BACKUP_DIR and DYNHOST_SUBDOMAIN are defined in the .env file."
  exit 1
fi

npm run strapi export -- --file "${BACKUP_DIR}${DATE}${DYNHOST_SUBDOMAIN}" --no-encrypt

# Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Backup created successfully: ${BACKUP_DIR}${DATE}${DYNHOST_SUBDOMAIN}.tar.gz"
else
  echo "Error: Backup failed."
  exit 1
fi

# Delete backups older than 2 months (60 days)
find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +60 -exec rm -f {} \;

# Check if old backups were deleted successfully
if [ $? -eq 0 ]; then
  echo "Old backups older than 2 months have been deleted successfully."
else
  echo "Error: Failed to delete old backups."
  exit 1
fi
