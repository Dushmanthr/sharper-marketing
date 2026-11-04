# VPS deployment & CI/CD — marketing.sharper-labs.com

Goal: add this site to the shared Hostinger VPS **without touching** `eioi_*` or `tvk-*`.

## How it stays isolated

| Concern | What this stack does |
|---|---|
| Containers / networks / volumes | Own compose project `sharper-marketing` → names like `sharper-marketing-app-1`; own private network |
| Database | Its own MySQL container, **no host port** (the VPS already uses 3306 and 6379 on loopback) |
| Host ports | Only `127.0.0.1:3010` (taken: 8080, 8443, 8081, 3306, 6379) |
| Web entry | Host nginx `sites-available/` → `sites-enabled/` vhost + Let's Encrypt, proxying to 3010 |
| CPU/RAM | Images are built on GitHub, not the VPS; app limited to 768 MB, MySQL to 512 MB |
| Deploys | Only `docker compose -p sharper-marketing …`; no global prune, no restarts of other containers |

---

## Part 1 — One-time VPS setup (SSH as `deploy`)

### 1.1 Pre-flight checks (read-only)
```bash
sudo ss -tlnp | grep -E ':(80|443|3010)\s'    # who owns 80/443? is 3010 free (must be empty)?
nginx -v ; ls /etc/nginx/sites-enabled/        # is host nginx installed, which sites exist?
free -h ; df -h /                              # leave headroom: this stack needs ~1.3 GB RAM max
```
- If host nginx **is** installed (the usual case when `sites-available` is mentioned), continue.
- If 80/443 are held by something else (e.g. a container), stop and tell me what; don't proceed blindly.
- If `3010` is taken, pick another free port and use it in both `.env` (`APP_PORT`) and the nginx file.

### 1.2 DNS
Create an **A record** `marketing.sharper-labs.com → <VPS public IP>` (and AAAA if you use IPv6). Check: `dig +short marketing.sharper-labs.com`.

### 1.3 Project folder
```bash
sudo mkdir -p /var/www/sharper-marketing
sudo chown deploy:deploy /var/www/sharper-marketing
chmod 750 /var/www/sharper-marketing
```

### 1.4 Runtime `.env` on the server (secrets stay on the VPS)
```bash
cd /var/www/sharper-marketing
install -m 600 /dev/null .env
nano .env
```
Contents (generate strong values with `openssl rand -hex 24` / `openssl rand -hex 32`):
```
REGISTRY_IMAGE=ghcr.io/sharper-labs-it/sharper-marketing
APP_PORT=3010

MYSQL_ROOT_PASSWORD=<random>
MYSQL_DATABASE=sharper_marketing
MYSQL_USER=sharper
MYSQL_PASSWORD=<random>

JWT_SECRET=<openssl rand -hex 32>

CONTACT_RECIPIENT_EMAIL=
NOREPLY_FROM_EMAIL=
RESEND_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```
`IMAGE_TAG` is written automatically by `deploy.sh`. Don't commit this file.

### 1.5 nginx site (available → enabled) and HTTPS
```bash
# copy deploy/nginx/marketing.sharper-labs.com.conf from the repo to the server
sudo cp marketing.sharper-labs.com.conf /etc/nginx/sites-available/marketing.sharper-labs.com
sudo ln -s /etc/nginx/sites-available/marketing.sharper-labs.com /etc/nginx/sites-enabled/
sudo nginx -t                      # MUST pass; if not, fix before continuing
sudo systemctl reload nginx        # reload (not restart) = zero downtime for other sites
```
Open the firewall only if it's not already open (`sudo ufw status`): `sudo ufw allow 'Nginx Full'`.

HTTPS (certbot only edits the new vhost because of `-d`):
```bash
sudo apt install -y certbot python3-certbot-nginx      # skip if already installed
sudo certbot --nginx -d marketing.sharper-labs.com --redirect -m <your-email> --agree-tos
sudo certbot renew --dry-run                           # confirm auto-renewal works
```
Back up first if you like: `sudo cp -a /etc/nginx /root/nginx-backup-$(date +%F)`.

> The site will return 502 until the first deploy finishes (nothing is on port 3010 yet). That's expected.

---

## Part 2 — Secure CI/CD

### Flow
push to `main` → GitHub builds the app + migrate images → pushes to **private GHCR** → `deploy` job (environment `production`) SSHes in as `deploy`, copies `docker-compose.prod.yml` + `deploy.sh`, logs in to GHCR with the **job's temporary token**, runs `deploy.sh <git-sha>` → healthcheck → **automatic rollback** to the previous tag if unhealthy → smoke test on the public URL.

### 2.1 Create a dedicated deploy key (on your laptop, not the VPS)
```bash
ssh-keygen -t ed25519 -f gh_marketing_deploy -C "github-actions marketing deploy" -N ""
ssh-copy-id -i gh_marketing_deploy.pub deploy@<VPS-IP>     # or append the .pub to ~deploy/.ssh/authorized_keys
```
Optional hardening: prefix that line in `authorized_keys` with `restrict ` so the key can't forward ports or get a TTY — but note scp/ssh commands still work.
Then get the server's host key fingerprint line for pinning:
```bash
ssh-keyscan -t ed25519 <VPS-IP>        # copy the full output line
```
Verify it matches the VPS: `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on the server.

### 2.2 GitHub repository settings (repo → Settings → Secrets and variables → Actions)

**Secrets** (encrypted):
| Name | Value |
|---|---|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | SSH port (omit if 22) |
| `VPS_SSH_KEY` | full contents of `gh_marketing_deploy` (private key, including BEGIN/END lines) |
| `VPS_KNOWN_HOSTS` | the `ssh-keyscan` output line from 2.1 |

**Variables** (public by design — these are inlined into the browser bundle at build time):
`NEXT_PUBLIC_SITE_URL` = `https://marketing.sharper-labs.com/`, plus `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_ACK_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_SHEETS_WEBAPP_URL`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

Why runtime secrets (DB passwords, `JWT_SECRET`, SMTP/Resend keys) are **not** in GitHub: they live only in `/var/www/sharper-marketing/.env` (mode 600), so a compromised workflow or fork can't read them.

For better security, put the five `VPS_*` secrets under **Settings → Environments → production** instead of repo level, and enable **Required reviewers** and **deployment branches: main only**.

Also: Settings → Branches → protect `main` (require PR + review), and Settings → Actions → General → Workflow permissions = *Read repository contents* (the workflow requests `packages: write` only where needed).

### 2.3 First deploy
Commit the files (`Dockerfile`, `deploy/`, `.github/`, etc.), push to `main`, and watch the Actions tab. When green:
```bash
docker compose -p sharper-marketing -f /var/www/sharper-marketing/docker-compose.prod.yml --env-file /var/www/sharper-marketing/.env ps
curl -I https://marketing.sharper-labs.com
```
Create the first admin user (seed) once:
```bash
cd /var/www/sharper-marketing
docker compose -p sharper-marketing -f docker-compose.prod.yml --env-file .env run --rm migrate npx prisma db seed
```
(Review `prisma/seed.ts` first to see what credentials it creates and change them immediately.)

---

## Operations
- Logs: `docker logs -f sharper-marketing-app-1`
- Manual rollback: `./deploy.sh <older-sha>` (previous tag is in `.previous_tag`)
- DB backup (cron-able): `docker exec sharper-marketing-db-1 sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" sharper_marketing' | gzip > ~/backups/marketing-$(date +%F).sql.gz`
- Uploads live in Docker volume `sharper-marketing_uploads`; back it up too.
- Never run `docker system prune`, `docker compose down` outside this project, or `docker restart $(docker ps -q)` on this server.
- Pin the GitHub Actions to commit SHAs (Dependabot can maintain them) for supply-chain safety.
