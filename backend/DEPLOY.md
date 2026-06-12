# Deploying the IndianRentals backend to a VPS

This guide takes you from **nothing** to a live HTTPS API at `https://api.indianrentals.com`
(swap in your real subdomain everywhere).

Architecture: **Internet → Nginx (port 443, SSL) → Node/Express (port 5000, via PM2)**.
All data lives in managed clouds already (MongoDB Atlas, Cloudinary, Brevo, Fast2SMS),
so the server itself is stateless and safe to rebuild anytime.

---

## 1. Create the server

Pick one provider. Cheapest workable size is fine — this is a light API.

**Hetzner (cheapest, ~€4/mo):** Cloud → Add Server → Ubuntu 24.04 → CX22 (2 vCPU / 4 GB) →
add your SSH key → Create.

**DigitalOcean (simplest UX, ~$6/mo):** Create → Droplet → Ubuntu 24.04 →
Basic Regular $6 (1 GB) → add your SSH key → Create.

> Choose a region near your users (e.g. Bangalore/India for both).

Note the server's **public IP** (e.g. `203.0.113.10`).

---

## 2. Point your subdomain at the server (DNS)

In your domain registrar / DNS provider, add an **A record**:

| Type | Name (host) | Value         | TTL  |
|------|-------------|---------------|------|
| A    | `api`       | `<SERVER_IP>` | Auto |

This makes `api.indianrentals.com → <SERVER_IP>`. DNS can take a few minutes to
propagate. Verify with: `ping api.indianrentals.com` (should show the server IP).

---

## 3. Connect and do basic hardening

From your PC:

```bash
ssh root@<SERVER_IP>
```

Then on the server:

```bash
# Update packages
apt update && apt upgrade -y

# Create a non-root user (optional but recommended)
adduser deploy
usermod -aG sudo deploy

# Basic firewall: allow SSH + web traffic only
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## 4. Install Node.js, PM2, Nginx, Certbot

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 (process manager) + build tools (bcrypt needs them)
npm install -g pm2
apt install -y build-essential

# Nginx (reverse proxy) + Certbot (free SSL)
apt install -y nginx certbot python3-certbot-nginx
```

Verify: `node -v` (should print v20.x) and `nginx -v`.

---

## 5. Get the code onto the server

Your repo is on GitHub: `https://github.com/sudheeesh/IndianRentals.git`

```bash
cd /var/www 2>/dev/null || (mkdir -p /var/www && cd /var/www)
cd /var/www
git clone https://github.com/sudheeesh/IndianRentals.git
cd IndianRentals/backend
npm install --omit=dev
```

> If the repo is **private**, GitHub will ask for a username + Personal Access Token
> (create one at github.com → Settings → Developer settings → Tokens), or set up a
> deploy SSH key. If it's public, the clone just works.

---

## 6. Create the production `.env`

The `.env` file is **not** in git (correctly), so create it on the server:

```bash
nano /var/www/IndianRentals/backend/.env
```

Paste your real values (copy from your local `backend/.env`) and **add `NODE_ENV`**:

```env
NODE_ENV=production
PORT=5000

MONGO_URI=mongodb+srv://...           # your Atlas connection string
JWT_SECRET=...                        # your existing secret

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Razorpay — replace the placeholders with REAL keys or payments won't work
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=2525
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=shop.indianrenters@gmail.com

FAST2SMS_API_KEY=...

# CORS — your live Vercel URLs
FRONTEND_URL=https://indian-rentals.vercel.app
ADMIN_URL=https://indian-rentals-yy8s.vercel.app
```

Save: `Ctrl+O`, `Enter`, then `Ctrl+X`.

---

## 7. Allow the server to reach MongoDB Atlas

In **MongoDB Atlas → Network Access → Add IP Address**, add your **server's public IP**
(`<SERVER_IP>/32`). Without this, the API can't connect to the database.

> A VPS has a fixed IP, so this is a one-time, clean allowlist entry.

---

## 8. Start the API with PM2

```bash
cd /var/www/IndianRentals/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # run the command it prints, so the API restarts on reboot
```

Check it's alive locally on the server:

```bash
curl http://127.0.0.1:5000/api/health
# -> {"status":"ok","db":"connected",...}
```

Useful later: `pm2 logs indianrentals-api`, `pm2 restart indianrentals-api`.

---

## 9. Configure Nginx + HTTPS

```bash
# Copy the provided config (edit the server_name to your subdomain first if needed)
cp /var/www/IndianRentals/backend/deploy/nginx.conf /etc/nginx/sites-available/indianrentals-api
nano /etc/nginx/sites-available/indianrentals-api    # set server_name to api.indianrentals.com

ln -s /etc/nginx/sites-available/indianrentals-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default               # remove the default placeholder site
nginx -t && systemctl reload nginx

# Issue the free SSL certificate (auto-renews)
certbot --nginx -d api.indianrentals.com
```

Certbot edits the Nginx config to add HTTPS on port 443 and redirect HTTP → HTTPS.

Verify from your PC:

```bash
curl https://api.indianrentals.com/api/health
```

---

## 10. Point the frontends at the live API

In **Vercel** (for BOTH the `frontend` and `admin` projects):
Settings → Environment Variables → set

```
NEXT_PUBLIC_API_URL = https://api.indianrentals.com
```

Then **redeploy** each project so the new value is baked in.

---

## Admin / frontend build notes (Next.js)

The `admin` and `frontend` apps deploy on **Vercel** (Linux), where `next build`
runs cleanly — nothing special is required there.

**Building the `admin` app locally on Windows fails** with:

```
Error occurred prerendering page "/_global-error".
TypeError: Cannot read properties of null (reading 'useContext')
```

This is **not a bug in our code** — it is a Next.js 16 issue prerendering the
internal `/_global-error` shell on Windows. It reproduces on a brand-new, empty
`next@16` app with zero dependencies, and across Node 20 and Node 22. It does
**not** occur on Linux (so Vercel and any CI/Docker-Linux pipeline build fine).

What we already did so the rest of the app builds:
- `admin/src/app/layout.js` sets `export const dynamic = "force-dynamic"` — the
  admin is a fully client-side, auth-gated SPA with no SEO/static needs, so every
  route is server-rendered on demand. This fixed all ~100 pages (they were also
  failing to prerender via `next-themes` under React 19).

To build locally on Windows, use the debug-prerender variant, which skips the
crashing static export of the error shell:

```bash
cd admin
npm run build:local      # = next build --debug-prerender
```

`npm run build` (plain `next build`) remains the command Vercel/Linux uses — do
**not** change it to the debug variant, since that produces un-minified server
bundles meant for debugging. Net effect: deploy via Vercel/Linux as normal;
only local Windows builds need `build:local`.

---

## Updating the backend later

```bash
cd /var/www/IndianRentals
git pull
cd backend
npm install --omit=dev
pm2 restart indianrentals-api
```

---

## Before you go live — small hardening (optional but recommended)

- **Remove the debug route** `GET /api/test-email` in `index.js` — it returns email
  config and stack traces to anyone who hits it.
- Razorpay keys in `.env` are still placeholders (`your_razorpay_key_id`). Real keys
  are required for payments to work.
