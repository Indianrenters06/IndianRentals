// PM2 process config for the public storefront (Next.js) on the Hostinger VPS.
// Nginx proxies / -> 3000 (this app) and /api + /uploads -> 5000 (the Express API).
// Usage on the server (from the frontend/ folder):
//   npm ci && npm run build
//   pm2 start ecosystem.config.js
//   pm2 save
module.exports = {
  apps: [
    {
      name: 'indianrentals-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
