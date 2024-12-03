module.exports = {
  apps: [
    {
      name: 'strapi',
      script: 'npm',
      args: 'start',
      // Enable auto-restart (default behavior in PM2)
    },
    {
      name: 'updateDNS',
      script: './scripts/update-dynhost.sh', // Specify the path to your bash script
      cron_restart: '*/1 * * * *', // This will restart the script every minute
      watch: false, // Disable watching for changes (since this is a bash script)
      autorestart: false,
      env_file: '.env',
    },
    {
      name: 'backups',
      script: "./scripts/backups.sh",
      cron_restart: '0 0 * * *',
      watch: false,
      autorestart: false,
      env_file: '.env',
    },
  ],
};
