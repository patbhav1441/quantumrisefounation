# 🍓 Raspberry Pi 4 - Advanced Guide & Troubleshooting

Complete advanced setup, optimization, and troubleshooting for RISE Foundation on Raspberry Pi 4

---

## 🎯 System Architecture on Raspberry Pi

```
┌────────────────────────────────────────────┐
│    quantumrisefoundation.org               │
│    (Your Raspberry Pi 4)                   │
├────────────────────────────────────────────┤
│                                            │
│  Internet                                  │
│    ↓ (HTTPS port 443)                     │
│  ┌──────────────────┐                      │
│  │   Nginx          │  ← Reverse Proxy     │
│  │  (Port 80, 443)  │  ← SSL/TLS           │
│  └────────┬─────────┘                      │
│           │                                │
│  ┌────────┴──────────┬──────────┐          │
│  ↓                   ↓          ↓          │
│ /         /api/      /health    /static   │
│  ↓                   ↓          ↓          │
│ React    Node.js    Health     Static     │
│ App      API Server Check      Files      │
│ (dist/)  (Port 5000)                      │
│  │                                        │
│  └─────────────────────┬──────────────┐   │
│                        ↓              ↓   │
│                   PostgreSQL      OpenAI  │
│                   (Port 5432)      (API)  │
│                   quantumrise_prod         │
│                                            │
└────────────────────────────────────────────┘
```

---

## 💾 Storage & Disk Management

### Check Disk Usage

```bash
# Current usage
df -h

# Detailed breakdown
du -sh ~/apps/*
du -sh /var/log/*

# Monitor in real-time
watch -n 2 df -h

# Find large files
find ~ -type f -size +100M -exec ls -lh {} \;
```

### Clean Up Space

```bash
# Remove old log files
sudo journalctl --vacuum=50M
sudo journalctl --vacuum=time:7d

# Clean apt cache
sudo apt clean
sudo apt autoclean

# Remove node_modules and rebuild if needed (saves ~500MB)
cd ~/apps/RISE-Fondation/backend
rm -rf node_modules
npm ci --production

# Find and remove temp files
sudo find /tmp -type f -atime +7 -delete
```

### Monitor Node.js Memory

```bash
# Check Node.js process
ps aux | grep "node server.js"

# Monitor memory usage
watch -n 1 'ps aux | grep node | grep -v grep'

# Get memory stats
node -e "
const used = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
const total = Math.round(require('os').totalmem() / 1024 / 1024);
console.log('Node heap: ' + used + 'MB / System: ' + total + 'MB');
"
```

---

## 🚀 Performance Optimization

### 1. Nginx Configuration Tuning

```bash
# Edit Nginx worker settings
sudo nano /etc/nginx/nginx.conf

# Optimize for Raspberry Pi 4:
worker_processes 4;                    # 4 cores on Pi 4
worker_connections 512;                # Lower than servers
keepalive_timeout 30;                  # Reduce timeout
client_body_timeout 20;
client_header_timeout 20;
send_timeout 20;

# Enable caching for static files
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=cache:10m;

# Reload Nginx
sudo systemctl reload nginx
```

### 2. PostgreSQL Tuning for Raspberry Pi

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/postgresql.conf

# For 4GB RAM Raspberry Pi:
shared_buffers = 256MB              # 25% of RAM
effective_cache_size = 1GB          # 25% of RAM
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
random_page_cost = 1.1
effective_io_concurrency = 200

# For 8GB RAM Raspberry Pi:
shared_buffers = 512MB
effective_cache_size = 2GB
maintenance_work_mem = 128MB

# Restart PostgreSQL
sudo systemctl restart postgresql

# Verify settings
sudo -u postgres psql -c "SHOW shared_buffers;"
```

### 3. Node.js Memory Limits

```bash
# Edit systemd service
sudo nano /etc/systemd/system/quantumrise-api.service

# Add memory limit (e.g., max 500MB):
[Service]
MemoryLimit=500M
MemoryMax=600M

# Or set NODE memory
Environment="NODE_OPTIONS=--max-old-space-size=256"

# Reload
sudo systemctl daemon-reload
sudo systemctl restart quantumrise-api
```

### 4. System-Level Optimization

```bash
# Enable memory overcommit (helps with swaps)
echo "vm.overcommit_memory = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Increase file descriptors
sudo bash -c 'echo "* soft nofile 65536" >> /etc/security/limits.conf'
sudo bash -c 'echo "* hard nofile 65536" >> /etc/security/limits.conf'

# Disable power saving features that slowdown Pi
sudo nano /boot/config.txt
# Add:
# gpu_mem=64          # Minimal GPU memory
# dtoverlay=disable-bt  # Disable Bluetooth
# over_voltage=2      # Mild overclock (optional, may reduce Pi lifespan)

# Reboot
sudo reboot
```

---

## 🔍 Monitoring & Logging

### Real-Time Monitoring Dashboard

```bash
# Create monitoring script
cat > ~/monitor.sh << 'EOF'
#!/bin/bash
clear
while true; do
    echo "╔════════════════════════════════════════════╗"
    echo "║   RISE Foundation - Raspberry Pi Monitor   ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "📊 System Status:"
    uptime
    echo ""
    echo "💾 Memory Usage:"
    free -h | head -2
    echo ""
    echo "📁 Disk Usage:"
    df -h | head -2
    echo ""
    echo "🔧 Service Status:"
    systemctl is-active postgresql && echo "✅ PostgreSQL: Running" || echo "❌ PostgreSQL: Stopped"
    systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Stopped"
    systemctl is-active quantumrise-api && echo "✅ API: Running" || echo "❌ API: Stopped"
    echo ""
    echo "🌐 Network Connections:"
    netstat -tuln | grep -E ':(80|443|5000|5432)' | wc -l
    echo ""
    echo "⏰ Last Updated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "Press Ctrl+C to exit"
    sleep 5
    clear
done
EOF

chmod +x ~/monitor.sh
./monitor.sh
```

### Setup Comprehensive Logging

```bash
# Create logs directory
mkdir -p ~/logs

# Create logging script for backend
cat > ~/logs/backend.log.config << 'EOF'
/var/log/quantumrise-api.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        systemctl reload quantumrise-api > /dev/null 2>&1 || true
    endscript
}
EOF

# Add to logrotate
sudo cp ~/logs/backend.log.config /etc/logrotate.d/quantumrise-api

# Test logrotate
sudo logrotate -f /etc/logrotate.d/quantumrise-api

# View logs
tail -f ~/logs/quantumrise-api.log
```

---

## 🔒 Security Hardening

### 1. SSH Security

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended settings:
Port 2222                          # Change default port
PermitRootLogin no
PasswordAuthentication no          # Use key-based auth only
PubkeyAuthentication yes
X11Forwarding no
Protocol 2

# Restart SSH
sudo systemctl restart sshd

# Test connection (from client):
ssh -p 2222 your_username@your_pi_ip
```

### 2. Firewall Hardening

```bash
# View all rules
sudo ufw status numbered

# Delete unnecessary rules
sudo ufw delete [number]

# Add rate limiting for SSH
sudo ufw limit 2222/tcp

# Add rate limiting for web
sudo ufw limit 80/tcp
sudo ufw limit 443/tcp

# Block everything by default
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Show firewall logs
sudo tail -f /var/log/ufw.log
```

### 3. Fail2Ban Setup (Prevent Brute Force)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create config
sudo tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 2222

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
EOF

# Start Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check banned IPs
sudo fail2ban-client status
```

### 4. Secure Nginx Configuration

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/quantumrise

# Add security headers:
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(),microphone=(),camera=()" always;

# Disable server tokens
server_tokens off;

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔄 Backup & Recovery

### Automated Daily Backups

```bash
# Create backup script
cat > ~/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/$(whoami)/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U prod_user -d quantumrise_prod | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Backup application (exclude node_modules)
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" \
  --exclude='node_modules' \
  --exclude='.git' \
  ~/apps/RISE-Fondation

# Remove old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

chmod +x ~/backup.sh

# Schedule with cron
crontab -e

# Add line:
# 0 3 * * * /home/your_username/backup.sh >> /home/your_username/logs/backup.log 2>&1
```

### Restore from Backup

```bash
# Restore database
gunzip < ~/backups/db_20241115_030000.sql.gz | psql -U prod_user -d quantumrise_prod

# Restore application
cd ~/apps
tar -xzf ~/backups/app_20241115_030000.tar.gz

# Restart services
sudo systemctl restart postgresql
sudo systemctl restart quantumrise-api
```

---

## 🐛 Detailed Troubleshooting

### Backend Service Issues

```bash
# Check service status
sudo systemctl status quantumrise-api

# View logs with more context
sudo journalctl -u quantumrise-api -n 100 --no-pager

# Follow logs in real-time
sudo journalctl -u quantumrise-api -f

# Check if port 5000 is listening
netstat -tlnp | grep 5000
lsof -i :5000

# Test connection locally
curl -v http://localhost:5000/health

# Run backend manually to see errors
cd ~/apps/RISE-Fondation/backend
node server.js
```

### Database Connection Issues

```bash
# Test PostgreSQL service
sudo systemctl status postgresql

# Connect directly to test
psql -U prod_user -d quantumrise_prod -c "SELECT 1;"

# Check database logs
sudo tail -f /var/log/postgresql/postgresql.log

# Verify user and database exist
sudo -u postgres psql -l
sudo -u postgres psql -c "\du"

# Check permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE quantumrise_prod TO prod_user;"

# Test with password
PGPASSWORD='your_password' psql -h localhost -U prod_user -d quantumrise_prod -c "SELECT 1;"
```

### Nginx / SSL Issues

```bash
# Test Nginx configuration
sudo nginx -t

# View Nginx error log
sudo tail -f /var/log/nginx/error.log

# View access log
sudo tail -f /var/log/nginx/access.log

# Check certificate expiration
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Check SSL configuration
sudo openssl s_client -connect localhost:443 -servername quantumrisefoundation.org

# Test from outside
curl -vI https://quantumrisefoundation.org
```

### Memory & Performance Issues

```bash
# View top processes by memory
ps aux --sort=-%mem | head

# View top processes by CPU
ps aux --sort=-%cpu | head

# Memory info
cat /proc/meminfo | grep -E 'MemTotal|MemAvailable|MemFree'

# Check Node.js memory
ps aux | grep "node server.js"

# If memory too high, restart service
sudo systemctl restart quantumrise-api

# Check for memory leaks (run for 1 hour, check if grows)
watch -n 60 'ps aux | grep "node server.js" | grep -v grep'
```

### DNS Issues

```bash
# Check if domain resolves
nslookup quantumrisefoundation.org
dig quantumrisefoundation.org
host quantumrisefoundation.org

# Check DNS records
dig @8.8.8.8 quantumrisefoundation.org

# Flush DNS cache (if needed)
sudo systemd-resolve --flush-caches

# Check local DNS resolution
cat /etc/resolv.conf
```

---

## 📊 Performance Benchmarking

### Benchmark Backend

```bash
# Install Apache Bench
sudo apt install -y apache2-utils

# Simple load test
ab -n 100 -c 10 http://localhost:5000/health

# Test API endpoint
ab -n 100 -c 10 -p payload.json -T application/json http://localhost:5000/api/test

# More detailed test
wrk -t4 -c10 -d30s http://localhost:5000/health
```

### Monitor Performance

```bash
# Real-time resource monitoring
htop

# Memory over time
watch -n 1 'free -h'

# Disk I/O
iostat -x 1

# Network bandwidth
nethogs

# Process tree
pstree -p

# System load
w
load average
```

---

## 🔧 Update & Maintenance

### Keep System Updated

```bash
# Update OS
sudo apt update && sudo apt upgrade -y

# Update Node.js
sudo apt list --upgradable | grep nodejs

# Update npm packages
cd ~/apps/RISE-Fondation
npm update

# Update certificates auto-renewal
sudo systemctl status certbot.timer

# Check for security updates
sudo unattended-upgrades --dry-run -d
```

### Regular Maintenance Tasks

```bash
# Weekly checks
# 1. Check disk space: df -h
# 2. Review logs: sudo journalctl -x
# 3. Check services: systemctl status quantumrise-api nginx postgresql
# 4. Verify backups: ls -lh ~/backups/

# Monthly tasks
# 1. Full system update: sudo apt update && sudo apt upgrade -y
# 2. Review firewall rules: sudo ufw status
# 3. Check certificate expiry: sudo certbot certificates
# 4. Verify DNS: dig quantumrisefoundation.org

# Quarterly tasks
# 1. Database optimization: sudo -u postgres vacuumdb quantumrise_prod
# 2. Log rotation: sudo logrotate -f /etc/logrotate.d/*
# 3. Security audit: sudo ufw status verbose
```

---

## 📈 Scaling Considerations

### If Service Gets Slow

```bash
# 1. Add swap memory
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 2. Enable database caching
psql -U prod_user -d quantumrise_prod -c "ANALYZE;"

# 3. Optimize Node.js
# Edit /etc/systemd/system/quantumrise-api.service
# Add: Environment="NODE_OPTIONS=--max-old-space-size=512 --gc-interval=100"

# 4. Cache responses
# Edit Nginx config to cache API responses
```

### Monitor Growth

```bash
# Track database size
sudo -u postgres psql -d quantumrise_prod -c "SELECT pg_size_pretty(pg_database_size('quantumrise_prod'));"

# Track application size
du -sh ~/apps/RISE-Fondation/

# Monitor user growth (track table sizes)
sudo -u postgres psql -d quantumrise_prod << 'EOF'
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
EOF
```

---

## 🎓 Learning Resources

### For Raspberry Pi Management
- Official Docs: https://www.raspberrypi.com/documentation/
- Raspberry Pi OS: https://www.raspberrypi.com/software/

### For Web Servers
- Nginx: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/docs/

### For Databases
- PostgreSQL: https://www.postgresql.org/docs/
- Performance Tuning: https://wiki.postgresql.org/wiki/Performance_Optimization

### For Node.js
- Node.js Docs: https://nodejs.org/en/docs/
- NPM Registry: https://www.npmjs.com/

---

## ✅ Maintenance Checklist

- [ ] System updated (monthly)
- [ ] Backups running (daily)
- [ ] SSL certificate valid (check quarterly)
- [ ] Disk space available (>10% free)
- [ ] Memory usage healthy (<80%)
- [ ] All services running
- [ ] Logs reviewed for errors
- [ ] Firewall rules correct
- [ ] Users informed of status

---

**Your RISE Foundation is production-ready on Raspberry Pi 4!** 🍓✨

*Use this guide for ongoing optimization and troubleshooting*
