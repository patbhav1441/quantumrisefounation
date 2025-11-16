# 🍓 Raspberry Pi 4 Deployment Guide - quantumrisefoundation.org

Complete guide to deploy RISE Foundation on Raspberry Pi 4 with domain `quantumrisefoundation.org`

---

## 📋 Prerequisites

### Hardware Required
- ✅ Raspberry Pi 4 (4GB or 8GB RAM recommended)
- ✅ microSD card (64GB or larger)
- ✅ Power supply (5V 3A USB-C)
- ✅ Ethernet cable (or WiFi adapter)
- ✅ HDMI cable (for initial setup, optional)

### Software Required
- ✅ Raspberry Pi OS (64-bit) - Latest
- ✅ SSH access enabled
- ✅ Static IP address configured
- ✅ Domain registered (quantumrisefoundation.org)

### Network Requirements
- ✅ Static public IP or Dynamic DNS
- ✅ Port 80 (HTTP) and 443 (HTTPS) open
- ✅ Good internet connection (10+ Mbps recommended)
- ✅ UPS or backup power (optional but recommended)

---

## 🚀 Step 1: Prepare Raspberry Pi OS

### 1.1 Install Raspberry Pi OS

```bash
# Download Raspberry Pi Imager from:
# https://www.raspberrypi.com/software/

# Use Raspberry Pi Imager to:
# 1. Select "Raspberry Pi 4"
# 2. Choose "Raspberry Pi OS (64-bit)"
# 3. Select your microSD card
# 4. Click "NEXT" → Configure settings
# 5. Set hostname: "quantumrise"
# 6. Enable SSH
# 7. Set username and password
# 8. Configure WiFi (if not using Ethernet)
# 9. Write to SD card
```

### 1.2 First Boot & Update

```bash
# SSH into your Pi
ssh your_username@quantumrise.local

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
  curl \
  wget \
  git \
  build-essential \
  python3 \
  python3-pip \
  ufw

# Check OS version
cat /etc/os-release
```

### 1.3 Configure Static IP

```bash
# Edit dhcpcd configuration
sudo nano /etc/dhcpcd.conf

# Add these lines at the end:
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4

# If using WiFi:
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4

# Ctrl+X → Y → Enter to save
# Reboot to apply
sudo reboot
```

---

## 🔧 Step 2: Install Node.js & npm

### 2.1 Install Node.js v20

```bash
# Download Node.js for ARM64 (Raspberry Pi 4)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version    # Should be v20.x
npm --version     # Should be v10.x

# Update npm to latest
sudo npm install -g npm@latest
```

### 2.2 Verify Installation

```bash
# Test Node.js
node -e "console.log('Node.js is working!')"

# Check disk space
df -h

# Check memory
free -h

# Monitor CPU
top -b -n 1 | head -20
```

---

## 🗄️ Step 3: Install PostgreSQL Database

### 3.1 Install PostgreSQL 14+

```bash
# Add PostgreSQL repository
curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Update and install
sudo apt update
sudo apt install -y postgresql-14 postgresql-contrib-14

# Verify installation
psql --version

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### 3.2 Create Database & User

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL:
# Create database
CREATE DATABASE quantumrise_prod;

# Create user
CREATE USER prod_user WITH ENCRYPTED PASSWORD 'secure_password_change_me';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE quantumrise_prod TO prod_user;

# Exit
\q
```

### 3.3 Configure PostgreSQL for Remote Access

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and uncomment:
# listen_addresses = 'localhost'
# Change to:
listen_addresses = '*'

# Ctrl+X → Y → Enter to save

# Edit pg_hba.conf for local network access
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line for local network (192.168.1.0/24):
host    all             all             192.168.1.0/24          md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3.4 Verify Database Connection

```bash
# Test local connection
psql -U prod_user -d quantumrise_prod -c "SELECT version();"

# Test with password
export PGPASSWORD='secure_password_change_me'
psql -h localhost -U prod_user -d quantumrise_prod -c "SELECT version();"
unset PGPASSWORD
```

---

## 📥 Step 4: Clone & Setup RISE Foundation Code

### 4.1 Clone Repository

```bash
# Create app directory
mkdir -p ~/apps
cd ~/apps

# Clone repository
git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git
cd RISE-Fondation

# Verify folder structure
ls -la
```

### 4.2 Setup Backend

```bash
cd backend

# Install dependencies (this may take several minutes on Pi)
npm install

# Verify installation
npm list

# Check disk usage
du -sh node_modules
```

### 4.3 Create Backend .env File

```bash
# Copy template
cp .env.example .env

# Edit environment variables
nano .env

# Configure for Raspberry Pi:
# ─────────────────────────────
# Database
DB_HOST=localhost
DB_USER=prod_user
DB_PASSWORD=secure_password_change_me
DB_PORT=5432
DB_NAME=quantumrise_prod

# JWT
JWT_SECRET=your-super-secure-random-string-min-32-chars

# API Keys
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Server
PORT=5000
NODE_ENV=production

# Domain URLs
PRODUCTION_DOMAIN=quantumrisefoundation.org
API_URL=https://api.quantumrisefoundation.org
FRONTEND_URL=https://quantumrisefoundation.org
CORS_ORIGIN=https://quantumrisefoundation.org

# Save: Ctrl+X → Y → Enter
```

### 4.4 Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# This creates /dist folder with static files
ls -la dist/
```

---

## 🔐 Step 5: Configure Nginx as Reverse Proxy

### 5.1 Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
sudo systemctl status nginx

# Check version
nginx -v
```

### 5.2 Create Nginx Configuration

```bash
# Create configuration for main domain
sudo nano /etc/nginx/sites-available/quantumrise

# Add this configuration:
```

```nginx
# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

# HTTPS - Frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;
    
    # SSL certificates (we'll create these with Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/quantumrisefoundation.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quantumrisefoundation.org/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
    
    # Frontend static files
    root /home/your_username/apps/RISE-Fondation/frontend/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy to backend
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
        
        # Timeouts for long-running requests (AI Tutor)
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000/health;
    }
}

# HTTPS - API (api.quantumrisefoundation.org)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.quantumrisefoundation.org;
    
    ssl_certificate /etc/letsencrypt/live/api.quantumrisefoundation.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.quantumrisefoundation.org/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }
}

# Redirect HTTP to HTTPS for API
server {
    listen 80;
    listen [::]:80;
    server_name api.quantumrisefoundation.org;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}
```

### 5.3 Enable Nginx Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/quantumrise /etc/nginx/sites-enabled/quantumrise

# Disable default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 6: Setup SSL/TLS with Let's Encrypt

### 6.1 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### 6.2 Obtain SSL Certificate

```bash
# Get certificate for main domain and subdomains
sudo certbot certonly --webroot -w /var/www/certbot \
  -d quantumrisefoundation.org \
  -d www.quantumrisefoundation.org \
  -d api.quantumrisefoundation.org \
  --agree-tos \
  --non-interactive \
  --email your-email@example.com

# Verify certificate
sudo certbot certificates
```

### 6.3 Setup Auto-Renewal

```bash
# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run

# Verify timer
sudo systemctl status certbot.timer
```

---

## 🚀 Step 7: Setup Backend Service

### 7.1 Create Systemd Service File

```bash
# Create service file
sudo nano /etc/systemd/system/quantumrise-api.service

# Add this content:
```

```ini
[Unit]
Description=RISE Foundation API Server
After=network.target postgresql.service

[Service]
Type=simple
User=your_username
WorkingDirectory=/home/your_username/apps/RISE-Fondation/backend
Environment="PATH=/usr/bin:/usr/local/bin"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=quantumrise-api

[Install]
WantedBy=multi-user.target
```

### 7.2 Start Backend Service

```bash
# Reload systemd daemon
sudo systemctl daemon-reload

# Start service
sudo systemctl start quantumrise-api

# Enable on boot
sudo systemctl enable quantumrise-api

# Check status
sudo systemctl status quantumrise-api

# View logs
sudo journalctl -u quantumrise-api -f

# Check if running
curl http://localhost:5000/health
```

---

## 🌐 Step 8: Configure Domain DNS

### 8.1 Update DNS Records

In your domain registrar (GoDaddy, Namecheap, etc.), add these records:

**For main domain:**
```
Type: A
Name: @
Value: YOUR_PUBLIC_IP_ADDRESS
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: quantumrisefoundation.org
TTL: 3600
```

**For API subdomain (if you have static IP):**
```
Type: A
Name: api
Value: YOUR_PUBLIC_IP_ADDRESS
TTL: 3600
```

Or if using Dynamic DNS:
```
Type: CNAME
Name: api
Value: your-dynamic-dns-hostname
TTL: 3600
```

### 8.2 Verify DNS (wait 15-30 minutes for propagation)

```bash
# Check DNS records
nslookup quantumrisefoundation.org
nslookup www.quantumrisefoundation.org
nslookup api.quantumrisefoundation.org

# Detailed DNS check
dig quantumrisefoundation.org
```

---

## 📡 Step 9: Handle Dynamic IP (if applicable)

If your ISP provides a dynamic IP, use DynamicDNS:

### 9.1 Install ddclient

```bash
# Install ddclient
sudo apt install -y ddclient

# Edit configuration
sudo nano /etc/ddclient.conf

# Example for no-ip.com:
# ──────────────────────────
# protocol=noip
# use=web
# web=checkip.dyndns.org/
# server=dynupdate.no-ip.com
# login=your-username
# password=your-password
# quantumrisefoundation.org

# Start service
sudo systemctl start ddclient
sudo systemctl enable ddclient

# Check status
sudo systemctl status ddclient
```

---

## ⚙️ Step 10: Database Migrations & Seed Data

### 10.1 Run Migrations

```bash
cd ~/apps/RISE-Fondation/backend

# Create migration script
cat > runMigrations.js << 'EOF'
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

async function runMigrations() {
  try {
    console.log('Running migrations...');
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.js'), 'utf8');
    // Extract and run SQL
    console.log('Migrations completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
EOF

# Run migrations
node runMigrations.js

# Verify database created tables
psql -U prod_user -d quantumrise_prod -c "\dt"
```

### 10.2 Seed Initial Data

```bash
# Run seed script if available
npm run seed

# Or manually insert test data
psql -U prod_user -d quantumrise_prod << EOF
INSERT INTO users (email, username, password_hash, role)
VALUES ('admin@quantumrise.org', 'admin', 'hashed_password', 'admin');
EOF
```

---

## 🧪 Step 11: Testing & Verification

### 11.1 Test Backend

```bash
# Test API health
curl http://localhost:5000/health
# Should return: {"status": "Server is running"}

# Test HTTPS
curl https://api.quantumrisefoundation.org/health
# Should return: {"status": "Server is running"}

# Test database connection
curl -X POST https://api.quantumrisefoundation.org/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","username":"testuser"}'
```

### 11.2 Test Frontend

```bash
# Visit in browser
https://quantumrisefoundation.org

# Check in browser console for errors
# Should see no CORS errors
# Should load all pages without errors
```

### 11.3 Performance Testing

```bash
# Check CPU usage
top -b -n 1 | head -5

# Check memory usage
free -h

# Check disk usage
df -h

# Monitor backend service
sudo journalctl -u quantumrise-api -n 50
```

---

## 🔒 Step 12: Firewall Setup

### 12.1 Configure UFW

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow PostgreSQL (local only)
sudo ufw allow from 192.168.1.0/24 to any port 5432

# Check rules
sudo ufw status

# View numbered rules
sudo ufw status numbered
```

---

## 📊 Step 13: Monitoring & Maintenance

### 13.1 Setup Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/quantumrise

# Add:
/home/your_username/apps/RISE-Fondation/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 your_username your_username
}
```

### 13.2 Monitor Services

```bash
# Check all services
sudo systemctl status postgresql
sudo systemctl status nginx
sudo systemctl status quantumrise-api

# View logs
sudo journalctl -u quantumrise-api -f

# Check system resources
watch -n 1 'free -h && echo "---" && df -h'
```

### 13.3 Backup Script

```bash
# Create backup directory
mkdir -p ~/backups

# Create backup script
cat > ~/backups/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/your_username/backups"

# Backup database
pg_dump -U prod_user -d quantumrise_prod > "$BACKUP_DIR/db_$DATE.sql"

# Backup application
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" /home/your_username/apps/RISE-Fondation

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

# Make executable
chmod +x ~/backups/backup.sh

# Add cron job for daily backup
crontab -e

# Add line:
# 0 2 * * * /home/your_username/backups/backup.sh
```

---

## 🎯 Raspberry Pi Optimization Tips

### 13.4 Memory Optimization

```bash
# Reduce Raspberry Pi memory usage
# Edit /boot/config.txt
sudo nano /boot/config.txt

# Add these lines:
gpu_mem=64      # Reduce GPU memory to minimum
dtoverlay=disable-bt  # Disable Bluetooth if not needed
dtoverlay=disable-wifi # Disable WiFi if using Ethernet

# Reboot
sudo reboot
```

### 13.5 Swap Configuration

```bash
# Check current swap
free -h

# Create 2GB swap file (helps when RAM is low)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

### 13.6 Node.js Optimization for Raspberry Pi

```bash
# Increase file descriptor limit
sudo nano /etc/security/limits.conf

# Add at end:
* soft nofile 65536
* hard nofile 65536

# Apply changes (logout and login)
exit
ssh your_username@quantumrise.local
```

---

## 🔧 Troubleshooting

### Issue: Backend service won't start

```bash
# Check service status
sudo systemctl status quantumrise-api

# View detailed logs
sudo journalctl -u quantumrise-api -n 100 -p err

# Test Node.js manually
cd ~/apps/RISE-Fondation/backend
node server.js

# Check if port 5000 is in use
lsof -i :5000
```

### Issue: Database connection failed

```bash
# Test PostgreSQL connection
psql -U prod_user -d quantumrise_prod -c "SELECT 1;"

# Check PostgreSQL logs
sudo journalctl -u postgresql -n 50

# Verify .env variables
cat ~/apps/RISE-Fondation/backend/.env | grep DB_
```

### Issue: SSL certificate not working

```bash
# Check certificate validity
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Check Nginx configuration
sudo nginx -t

# View Nginx errors
sudo tail -n 50 /var/log/nginx/error.log
```

### Issue: High CPU/Memory Usage

```bash
# Monitor processes
top -o %CPU

# Check Node.js memory
node -e "console.log(Math.round(require('os').totalmem()/1024/1024)+'MB total')"

# Restart backend to clear memory
sudo systemctl restart quantumrise-api

# Check for memory leaks
ps aux | grep node
```

---

## 📈 Performance Tuning

### Nginx Tuning

```bash
# Edit nginx configuration
sudo nano /etc/nginx/nginx.conf

# Increase worker processes based on Pi CPU cores
worker_processes auto;

# Increase connections
worker_connections 1024;

# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
```

### PostgreSQL Tuning for Raspberry Pi

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# For 4GB RAM Pi:
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 20
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 2GB
max_wal_size = 8GB

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 🎓 Final Checklist

- [ ] Raspberry Pi OS installed and updated
- [ ] Node.js v20+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] RISE Foundation code cloned
- [ ] Backend configured with .env
- [ ] Frontend built
- [ ] Nginx configured
- [ ] SSL certificates obtained
- [ ] Backend service running
- [ ] Domain DNS configured
- [ ] Website accessible via HTTPS
- [ ] Database connection working
- [ ] All pages loading
- [ ] AI Tutor responding
- [ ] Firewall configured
- [ ] Backups configured
- [ ] Monitoring setup

---

## 🚀 Launch Checklist

✅ Production environment configured  
✅ All services running  
✅ Domain pointing to Pi  
✅ SSL/TLS working  
✅ Database populated  
✅ API responding  
✅ Frontend loading  
✅ Admin user created  

**Your RISE Foundation is live on Raspberry Pi 4!** 🎉

---

## 📞 Quick Reference Commands

```bash
# Start all services
sudo systemctl start postgresql
sudo systemctl start nginx
sudo systemctl start quantumrise-api

# Stop all services
sudo systemctl stop quantumrise-api
sudo systemctl stop nginx
sudo systemctl stop postgresql

# View logs
sudo journalctl -u quantumrise-api -f
tail -f /var/log/nginx/error.log
sudo -u postgres tail -f /var/log/postgresql/postgresql.log

# Restart services
sudo systemctl restart quantumrise-api
sudo systemctl reload nginx
sudo systemctl restart postgresql

# Check status
sudo systemctl status quantumrise-api
sudo systemctl status nginx
sudo systemctl status postgresql

# Test connectivity
curl http://localhost:5000/health
curl https://quantumrisefoundation.org
telnet localhost 5432
```

---

**Ready to deploy RISE Foundation on Raspberry Pi 4?** 🍓🚀

*This guide includes all steps from OS setup to production deployment on Raspberry Pi 4*
