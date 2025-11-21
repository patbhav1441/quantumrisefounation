# 🍓 Raspberry Pi 5 Deployment Guide

Deploy RISE Foundation to Raspberry Pi 5 at **https://quantumrisefoundation.org**

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Raspberry Pi 5 (8GB RAM recommended)
- ✅ microSD card (64GB+ recommended)
- ✅ Raspberry Pi OS 64-bit (latest)
- ✅ SSH access to your Pi
- ✅ Domain: `quantumrisefoundation.org` (at your registrar)
- ✅ Public IP address or Dynamic DNS setup
- ✅ OpenAI API key (`sk-proj-...`)
- ✅ Git installed (comes with Raspberry Pi OS)

---

## 🚀 Quick Start (30 minutes)

### Step 1: SSH into Your Raspberry Pi 5

```bash
ssh pi@raspberry-pi-ip
# Or if you're on the Pi directly, skip this
```

### Step 2: Clone the Repository

```bash
cd /home/pi
git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git
cd RISE-Fondation
```

### Step 3: Update System and Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm postgresql nginx curl certbot python3-certbot-nginx
```

### Step 4: Verify Installations

```bash
node --version    # Should be v20+
npm --version     # Should be v10+
postgres --version  # Should be v14+
nginx -v          # Should show nginx version
```

### Step 5: Setup PostgreSQL Database

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE rise_foundation;
CREATE USER rise_user WITH PASSWORD 'change_this_password_123';
ALTER ROLE rise_user SET client_encoding TO 'utf8';
ALTER ROLE rise_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE rise_user SET default_transaction_deferrable TO on;
ALTER ROLE rise_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE rise_foundation TO rise_user;
\c rise_foundation
GRANT ALL ON SCHEMA public TO rise_user;
EOF
```

### Step 6: Configure Backend Environment Variables

```bash
cd backend
cp .env.example .env
nano .env
```

Add these values:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://rise_user:change_this_password_123@localhost:5432/rise_foundation
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_API_KEY_HERE
CORS_ORIGIN=https://quantumrisefoundation.org
FRONTEND_URL=https://quantumrisefoundation.org
```

**Save**: Press `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 7: Install Backend Dependencies

```bash
npm install
```

### Step 8: Setup Frontend

```bash
cd ../frontend
npm install
npm run build
```

### Step 9: Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/quantumrisefoundation.org
```

Paste this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;

    # SSL certificates (will be created in next step)
    ssl_certificate /etc/letsencrypt/live/quantumrisefoundation.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quantumrisefoundation.org/privkey.pem;

    # Security headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend static files
    location / {
        root /home/pi/RISE-Fondation/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 1h;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 600s;  # For AI tutor responses
        proxy_connect_timeout 60s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

**Save**: Press `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 10: Enable Nginx Site

```bash
sudo ln -s /etc/nginx/sites-available/quantumrisefoundation.org \
           /etc/nginx/sites-enabled/quantumrisefoundation.org

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 11: Get SSL Certificate with Let's Encrypt

```bash
sudo certbot certonly --nginx -d quantumrisefoundation.org -d www.quantumrisefoundation.org
```

Follow the prompts and confirm your email.

### Step 12: Create Systemd Service for Backend

```bash
sudo nano /etc/systemd/system/rise-backend.service
```

Paste:

```ini
[Unit]
Description=RISE Foundation Backend
After=network.target postgresql.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/RISE-Fondation/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment="NODE_ENV=production"
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Save**: Press `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 13: Enable and Start Backend Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable rise-backend.service
sudo systemctl start rise-backend.service

# Check status
sudo systemctl status rise-backend.service
```

### Step 14: Configure DNS at Your Registrar

Log into your domain registrar and add these DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_PI_PUBLIC_IP | 3600 |
| A | www | YOUR_PI_PUBLIC_IP | 3600 |
| AAAA | @ | YOUR_PI_IPV6 | 3600 |
| CNAME | api | quantumrisefoundation.org | 3600 |

Get your public IP:
```bash
curl -s https://api.ipify.org
```

### Step 15: Test Your Setup

```bash
# Check if backend is running
curl http://localhost:5000/health

# Check if Nginx is forwarding properly
curl -I http://localhost

# Check logs
sudo journalctl -u rise-backend.service -f
```

### Step 16: Wait for DNS Propagation

DNS usually propagates in 5-30 minutes. Check status:
```bash
nslookup quantumrisefoundation.org
```

### Step 17: Visit Your Site! 🎉

Open your browser and go to:
```
https://quantumrisefoundation.org
```

---

## 📊 Raspberry Pi 5 Specific Optimizations

### RAM & Memory Management

Raspberry Pi 5 has excellent performance. Default settings work well, but for optimization:

```bash
# Check available RAM
free -h

# View Node.js memory usage
ps aux | grep node
```

### Swap Configuration (If needed)

```bash
# Check swap
swapon --show

# If none exists, create 2GB swap
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Change: CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### PostgreSQL Optimization for Raspberry Pi 5

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Find and modify these settings:
```ini
shared_buffers = 128MB          # 25% of RAM
effective_cache_size = 512MB    # 50% of RAM
work_mem = 32MB
maintenance_work_mem = 128MB
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

## 🔧 Troubleshooting

### Backend Service Not Starting

```bash
# Check service logs
sudo journalctl -u rise-backend.service -n 50

# Manually test backend
cd /home/pi/RISE-Fondation/backend
node server.js
```

### Nginx Not Forwarding to Backend

```bash
# Check Nginx config
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Test connection to backend
curl -v http://localhost:5000
```

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql -U rise_user -d rise_foundation -h localhost
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew if needed
sudo certbot renew --dry-run
```

### Domain Not Resolving

```bash
# Check DNS
nslookup quantumrisefoundation.org
dig quantumrisefoundation.org

# Check your public IP
curl -s https://api.ipify.org

# Ensure firewall allows ports 80 and 443
sudo ufw status
```

---

## 📈 Monitoring Your Deployment

### Check Service Status

```bash
# Backend service
sudo systemctl status rise-backend.service

# Nginx
sudo systemctl status nginx

# PostgreSQL
sudo systemctl status postgresql

# All at once
sudo systemctl status rise-backend.service nginx postgresql
```

### View Logs

```bash
# Backend logs (real-time)
sudo journalctl -u rise-backend.service -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### System Resources

```bash
# Overall system stats
htop
# Press 'q' to exit

# Disk usage
df -h

# Memory usage
free -h

# Network connections
netstat -tlnp | grep LISTEN
```

---

## 🔄 Updates & Maintenance

### Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Update Node.js Dependencies

```bash
cd /home/pi/RISE-Fondation/backend
npm update

cd ../frontend
npm update
```

### Renew SSL Certificates (Automatic)

Certbot auto-renewal should be running. Verify:

```bash
sudo systemctl status certbot.timer
```

Manual renewal:
```bash
sudo certbot renew
sudo systemctl restart nginx
```

---

## 🛡️ Security Hardening

### Enable Firewall

```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw status
```

### SSH Key-Based Authentication (Recommended)

On your local machine:
```bash
ssh-copy-id pi@raspberry-pi-ip
```

Then disable password login:
```bash
sudo nano /etc/ssh/sshd_config
# Change: PasswordAuthentication no
sudo systemctl restart ssh
```

### Fail2Ban Protection

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📦 Backup & Recovery

### Backup Database Daily

```bash
# Create backup directory
mkdir -p /home/pi/backups

# Create backup script
nano /home/pi/backup.sh
```

Paste:
```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/home/pi/backups"
DB_NAME="rise_foundation"

sudo -u postgres pg_dump $DB_NAME | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Make executable and schedule:
```bash
chmod +x /home/pi/backup.sh

# Add to crontab
crontab -e
# Add line: 0 2 * * * /home/pi/backup.sh
```

### Restore from Backup

```bash
BACKUP_FILE="/home/pi/backups/backup_YYYY-MM-DD_HH-MM-SS.sql.gz"
zcat $BACKUP_FILE | sudo -u postgres psql rise_foundation
```

---

## 🎯 Performance Expectations

**Raspberry Pi 5 Performance**:
- Concurrent Users: 100-200
- Requests/Second: 500-1000
- Database Queries: 1000+/min
- CPU Usage: 20-40% (idle)
- Memory Usage: 1-2GB (with 8GB RAM)

For higher traffic, consider:
1. Upgrading to a more powerful server
2. Adding a second Raspberry Pi for load balancing
3. Using a CDN for static files

---

## ✅ Deployment Checklist

- [ ] Repository cloned
- [ ] Dependencies installed (Node.js, PostgreSQL, Nginx)
- [ ] Database created and configured
- [ ] Backend `.env` configured with API keys
- [ ] Frontend built
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate obtained
- [ ] Backend service created and running
- [ ] DNS records configured at registrar
- [ ] Domain resolving correctly
- [ ] HTTPS working at https://quantumrisefoundation.org
- [ ] Admin user created
- [ ] Backups configured

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs first**: 
   ```bash
   sudo journalctl -u rise-backend.service -n 50
   ```

2. **Common issues**:
   - Port 80/443 blocked: Check firewall rules
   - Database connection: Verify DATABASE_URL in `.env`
   - API key invalid: Check OPENAI_API_KEY is correct
   - Domain not resolving: Wait for DNS propagation or check registrar

3. **External resources**:
   - Raspberry Pi Docs: https://www.raspberrypi.com/documentation/
   - Nginx Docs: https://nginx.org/en/docs/
   - PostgreSQL Docs: https://www.postgresql.org/docs/
   - Node.js Docs: https://nodejs.org/en/docs/

---

## 🎉 You're Done!

Your RISE Foundation is now live at **https://quantumrisefoundation.org** on Raspberry Pi 5! 

**Next Steps**:
1. Create admin user account
2. Add lesson content
3. Test AI Tutor functionality
4. Share with students
5. Monitor performance

Enjoy! 🚀
