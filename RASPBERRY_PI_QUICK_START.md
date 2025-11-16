# 🍓 Raspberry Pi 4 Quick Setup - 30-Minute Guide

Fast-track deployment of RISE Foundation on Raspberry Pi 4

---

## ⚡ Prerequisites (Have Ready)

- ✅ Raspberry Pi 4 (4GB+ RAM)
- ✅ microSD card (64GB+) with Raspberry Pi OS 64-bit installed
- ✅ SSH access working
- ✅ Static IP configured (e.g., 192.168.1.100)
- ✅ Domain registered (quantumrisefoundation.org)
- ✅ Domain registrar access to configure DNS
- ✅ OpenAI API key
- ✅ Public IP or Dynamic DNS hostname

---

## 🚀 Step 1: Update System (5 min)

```bash
# SSH into Pi
ssh your_username@your_pi_ip

# Update everything
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y git curl wget build-essential ufw
```

---

## 2️⃣ Step 2: Install Node.js (5 min)

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

---

## 3️⃣ Step 3: Install & Setup PostgreSQL (10 min)

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres createdb quantumrise_prod

# Create user
sudo -u postgres createuser prod_user

# Set password
sudo -u postgres psql -c "ALTER USER prod_user WITH ENCRYPTED PASSWORD 'your_secure_password';"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE quantumrise_prod TO prod_user;"

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Enable remote connections
sudo nano /etc/postgresql/14/main/postgresql.conf
# Change: listen_addresses = '*'
# Then: sudo systemctl restart postgresql
```

---

## 4️⃣ Step 4: Clone & Setup Application (5 min)

```bash
# Create app directory
mkdir -p ~/apps && cd ~/apps

# Clone repository
git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git
cd RISE-Fondation

# Install backend dependencies
cd backend && npm install

# Create .env file
cp .env.example .env
nano .env

# Edit .env with your values:
# DB_HOST=localhost
# DB_USER=prod_user
# DB_PASSWORD=your_secure_password
# DB_NAME=quantumrise_prod
# JWT_SECRET=your-32-char-random-string
# OPENAI_API_KEY=sk-proj-...
# NODE_ENV=production
# CORS_ORIGIN=https://quantumrisefoundation.org

# Build frontend
cd ../frontend
npm install
npm run build
```

---

## 5️⃣ Step 5: Install Nginx & SSL (5 min)

```bash
# Install Nginx and Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/quantumrise
```

Paste this configuration:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org api.quantumrisefoundation.org;
    location / { return 301 https://$server_name$request_uri; }
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
}

# Frontend
server {
    listen 443 ssl http2;
    server_name quantumrisefoundation.org www.quantumrisefoundation.org;
    
    ssl_certificate /etc/letsencrypt/live/quantumrisefoundation.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quantumrisefoundation.org/privkey.pem;
    
    root /home/your_username/apps/RISE-Fondation/frontend/dist;
    
    location / { try_files $uri $uri/ /index.html; }
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 600s;
    }
}

# API Subdomain
server {
    listen 443 ssl http2;
    server_name api.quantumrisefoundation.org;
    
    ssl_certificate /etc/letsencrypt/live/api.quantumrisefoundation.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.quantumrisefoundation.org/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Then:

```bash
# Enable configuration
sudo ln -s /etc/nginx/sites-available/quantumrise /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 6️⃣ Step 6: Get SSL Certificate (2 min)

```bash
# Obtain certificate from Let's Encrypt
sudo certbot certonly --standalone \
  -d quantumrisefoundation.org \
  -d www.quantumrisefoundation.org \
  -d api.quantumrisefoundation.org \
  --agree-tos \
  --non-interactive \
  --email your-email@example.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 7️⃣ Step 7: Create Backend Service (3 min)

```bash
# Create service file
sudo tee /etc/systemd/system/quantumrise-api.service > /dev/null << EOF
[Unit]
Description=RISE Foundation API
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/apps/RISE-Fondation/backend
ExecStart=/usr/bin/node server.js
Restart=always
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl daemon-reload
sudo systemctl start quantumrise-api
sudo systemctl enable quantumrise-api

# Check status
sudo systemctl status quantumrise-api
```

---

## 8️⃣ Step 8: Configure DNS (2 min)

Go to your domain registrar and add:

```
Type: A
Name: @ or quantumrisefoundation.org
Value: YOUR_PUBLIC_IP
TTL: 3600
```

For subdomains (if static IP):

```
Type: A
Name: api
Value: YOUR_PUBLIC_IP
TTL: 3600
```

Or with CNAME (if using dynamic DNS):

```
Type: CNAME
Name: api
Value: your-dynamic-dns-hostname
```

Wait 15-30 minutes for DNS to propagate.

---

## 9️⃣ Step 9: Test Everything (2 min)

```bash
# Test backend
curl http://localhost:5000/health

# Wait for DNS propagation, then test:
curl https://api.quantumrisefoundation.org/health

# Visit in browser
https://quantumrisefoundation.org
```

---

## 🔟 Step 10: Firewall Setup (1 min)

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (local network only)
sudo ufw allow from 192.168.1.0/24 to any port 5432

# Check rules
sudo ufw status
```

---

## ✅ You're Done!

Your RISE Foundation is now live on Raspberry Pi 4:

- **Frontend**: https://quantumrisefoundation.org
- **API**: https://api.quantumrisefoundation.org
- **Database**: Running locally on PostgreSQL

---

## 🔧 Common Commands

```bash
# View logs
sudo journalctl -u quantumrise-api -f

# Restart backend
sudo systemctl restart quantumrise-api

# Restart Nginx
sudo systemctl reload nginx

# Stop all services
sudo systemctl stop quantumrise-api nginx postgresql

# Check memory/CPU
free -h && df -h && top -b -n 1 | head
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Backend won't start | Check: `systemctl status quantumrise-api` and logs |
| Database connection failed | Check: DB credentials in `.env` |
| Certificate error | Wait 5 min, then restart nginx: `sudo systemctl reload nginx` |
| CORS errors | Verify `CORS_ORIGIN` in `.env` matches domain |
| Page won't load | Check Nginx logs: `tail -f /var/log/nginx/error.log` |

---

## 📊 Monitoring

```bash
# Monitor everything
watch -n 2 'free -h && echo "---" && df -h'

# View all service logs
journalctl -u quantumrise-api -u postgresql -u nginx -n 30 -f
```

---

**Your RISE Foundation is now running on Raspberry Pi 4!** 🍓✨

*Total setup time: ~30 minutes*
