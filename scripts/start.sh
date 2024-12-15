#!/bin/bash

#load environment variables
set -a
source .env
set +a

if [ -z "$BACKUP_DIR" ] ; then 
  echo "Error: Required environment variables are not set. are you sure you have .env file in this directory?"
  exit 1
fi
#build admin panel
npm run build 

pm2 start ecosystem.config.js #  voir ce que fait l'option --env production


