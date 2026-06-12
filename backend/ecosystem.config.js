// PM2 process config — keeps the API running, restarts on crash & on server reboot.
// Usage on the server (from the backend/ folder):
//   pm2 start ecosystem.config.js
//   pm2 save                 # remember the process list across reboots
//   pm2 startup              # print the command to enable boot-time start
module.exports = {
  apps: [
    {
      name: 'indianrentals-api',
      script: 'index.js',
      instances: 1,            // bump to 'max' for cluster mode once traffic grows
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
