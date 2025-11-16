# 🚀 Deployment Guide - quantumrisefoundation.org

Complete guide to deploy the Quantum Rise Foundation platform to production domain.

---

## 📋 Overview

- **Domain**: `quantumrisefoundation.org`
- **Frontend**: React app hosted on Vercel/Netlify
- **Backend**: Express API hosted on Railway/Heroku  
- **Database**: PostgreSQL managed service
- **CDN**: Automatic with Vercel/Netlify
- **SSL**: Automatic with Let's Encrypt

---

## 🎯 Prerequisites

- GitHub repository access
- Domain registered (quantumrisefoundation.org)
- Domain registrar credentials
- Vercel or Netlify account
- Railway or Heroku account
- PostgreSQL database service account
- OpenAI API key

---

## 📦 Part 1: Database Setup

### Option A: Railway (Recommended)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Create new project

2. **Add PostgreSQL Plugin**
   - Click "Add Service"
   - Select "PostgreSQL"
   - Railway generates DATABASE_URL automatically

3. **Get Connection String**
   ```
   postgresql://user:password@host:port/database
   ```

### Option B: Heroku Postgres

1. **Create Heroku Account**
   - Go to https://heroku.com
   - Create new app

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Get Connection String**
   ```bash
   heroku config:get DATABASE_URL
   ```

### Option C: Self-Hosted VPS

1. **SSH into VPS**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install PostgreSQL**
   ```bash
   apt update && apt install postgresql postgresql-contrib
   ```

3. **Create Database**
   ```bash
   sudo -u postgres createdb quantumrise_prod
   sudo -u postgres createuser prod_user
   sudo -u postgres psql -c "ALTER USER prod_user WITH PASSWORD 'secure_password';"
   ```

---

## 🌐 Part 2: Domain Configuration

### Step 1: Registrar DNS Settings

1. **Access Domain Registrar**
   - Go to GoDaddy, Namecheap, etc.
   - Find DNS settings for `quantumrisefoundation.org`

2. **Add DNS Records**

For **Vercel/Netlify** frontend:
```
Type: CNAME
Name: @
Value: cname.vercel.com  (or your Netlify domain)
TTL: 3600
```

For **Railway** backend API:
```
Type: CNAME
Name: api
Value: railway.app hostname
TTL: 3600
```

Or with **Heroku**:
```
Type: CNAME
Name: api
Value: your-app.herokuapp.com
TTL: 3600
```

### Step 2: Verify DNS Propagation

```bash
# Check DNS propagation
nslookup quantumrisefoundation.org
nslookup api.quantumrisefoundation.org
```

---

## 🎨 Part 3: Frontend Deployment

### Option A: Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Authorize Vercel

2. **Configure Project**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://api.quantumrisefoundation.org
   ```

4. **Configure Domain**
   - In Vercel Dashboard → Settings → Domains
   - Add `quantumrisefoundation.org`
   - Vercel generates SSL certificate automatically

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit https://quantumrisefoundation.org

### Option B: Netlify

1. **Connect GitHub Repository**
   - Go to https://netlify.com
   - Click "Add New Site" → "Import an existing project"
   - Choose GitHub
   - Select your repo

2. **Configure Build**
   - Base Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Add Environment Variables**
   - Site Settings → Build & Deploy → Environment
   ```
   VITE_API_URL=https://api.quantumrisefoundation.org
   ```

4. **Configure Domain**
   - Domain Settings → Custom Domain
   - Add `quantumrisefoundation.org`
   - Update DNS records in registrar

5. **Deploy**
   - Netlify auto-deploys on GitHub push

---

## 🔧 Part 4: Backend Deployment

### Option A: Railway

1. **Create New Service**
   - Go to your Railway project
   - Click "Add Service" → "GitHub Repo"
   - Select RISE-Fondation repo

2. **Configure Service**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Port: `5000`

3. **Add Environment Variables**
   ```
   DATABASE_URL=postgresql://user:pass@host:port/quantumrise_prod
   JWT_SECRET=your-secure-random-string
   OPENAI_API_KEY=sk-proj-...
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://quantumrisefoundation.org
   ```

4. **Get API URL**
   - Railway provides: `your-app.up.railway.app`
   - Add to DNS as CNAME: `api.quantumrisefoundation.org`

5. **Deploy**
   - Railway auto-deploys on GitHub push

### Option B: Heroku

1. **Connect GitHub Repository**
   ```bash
   heroku login
   heroku create quantumrise-api
   heroku git:remote -a quantumrise-api
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set OPENAI_API_KEY=sk-proj-...
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://quantumrisefoundation.org
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option C: Custom VPS (DigitalOcean, AWS EC2, etc.)

1. **SSH into VPS**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install Node & Dependencies**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node --version  # Should be v20+
   ```

3. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git
   cd RISE-Fondation/backend
   ```

4. **Install Dependencies**
   ```bash
   npm install
   npm run migrate
   npm run seed
   ```

5. **Create .env**
   ```bash
   cat > .env << EOF
   DB_HOST=your-db-host
   DB_USER=prod_user
   DB_PASSWORD=secure_password
   DB_NAME=quantumrise_prod
   JWT_SECRET=very-secure-string
   OPENAI_API_KEY=sk-proj-...
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://quantumrisefoundation.org
   EOF
   ```

6. **Setup Reverse Proxy with Nginx**
   ```bash
   sudo apt-get install nginx
   ```

   Create `/etc/nginx/sites-available/quantumrisefoundation`
   ```nginx
   server {
       server_name api.quantumrisefoundation.org;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/quantumrisefoundation /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.quantumrisefoundation.org
   ```

8. **Setup PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "quantumrise-api"
   pm2 save
   pm2 startup
   ```

---

## ✅ Verification Checklist

### Frontend
- [ ] Domain loads: https://quantumrisefoundation.org
- [ ] SSL certificate valid (green lock)
- [ ] Pages load without errors
- [ ] Console shows no 404 errors
- [ ] Responsive on mobile

### Backend
- [ ] API endpoint responds: https://api.quantumrisefoundation.org/health
- [ ] Database connected
- [ ] Authentication working (test login/signup)
- [ ] AI Tutor responds to questions
- [ ] Environment variables set correctly

### Database
- [ ] Tables created: `users`, `lessons`, `user_progress`, `badges`, `user_badges`, `tutor_conversations`
- [ ] Seed data loaded
- [ ] Migrations ran successfully

### Domain
- [ ] DNS A records pointing correctly
- [ ] HTTPS working (automatic redirects)
- [ ] Email configured (optional)

---

## 🔒 Security Checklist

### Before Going Live

- [ ] Change JWT_SECRET to strong random string
- [ ] Change database password
- [ ] Enable HTTPS/SSL (automatic with Vercel/Netlify)
- [ ] Set NODE_ENV=production
- [ ] Hide .env file (never commit)
- [ ] Enable CORS for production domain only
- [ ] Setup rate limiting on API
- [ ] Configure firewall rules
- [ ] Setup monitoring/alerts
- [ ] Backup database regularly
- [ ] Enable database encryption at rest

### CORS Configuration

Update `backend/server.js`:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://quantumrisefoundation.org'
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
```

---

## 📊 Monitoring & Maintenance

### Setup Monitoring

1. **Vercel/Netlify Built-in**
   - Dashboard shows build status
   - Email alerts for failures
   - Performance metrics

2. **Railway/Heroku Monitoring**
   - CPU and memory usage
   - Deployment logs
   - Error tracking

3. **Custom Monitoring (Uptime Robot)**
   ```
   Monitor: https://quantumrisefoundation.org/health
   Monitor: https://api.quantumrisefoundation.org/health
   Alert on: Down for > 5 minutes
   ```

### Database Backups

**Railway/Heroku**: Automatic backups included

**Custom VPS**:
```bash
# Backup script
pg_dump -U prod_user -h localhost quantumrise_prod > backup.sql

# Restore
psql -U prod_user -d quantumrise_prod < backup.sql
```

---

## 🐛 Troubleshooting

### Domain Not Loading
```bash
# Check DNS
nslookup quantumrisefoundation.org
dig quantumrisefoundation.org

# Wait up to 48 hours for DNS propagation
```

### CORS Errors
- Check FRONTEND_URL in backend .env
- Update CORS_ORIGIN in backend
- Restart backend service

### Database Connection Failed
- Verify DATABASE_URL format
- Check database is running
- Verify network access (VPS firewall rules)

### API Endpoint 404
- Verify backend deployed successfully
- Check logs: `heroku logs` or Railway dashboard
- Verify PORT environment variable

### SSL Certificate Error
- Wait for Let's Encrypt validation
- Check domain DNS records
- Re-run certbot if needed

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Railway Docs**: https://railway.app/docs
- **Heroku Docs**: https://devcenter.heroku.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

## 🎉 Deployed!

Once verified, your platform is live at:
- **Frontend**: https://quantumrisefoundation.org
- **API**: https://api.quantumrisefoundation.org
- **Health Check**: https://api.quantumrisefoundation.org/health

### Post-Launch Tasks

1. Setup analytics (Google Analytics)
2. Create admin user for content
3. Add real lesson content
4. Notify stakeholders
5. Monitor performance
6. Gather user feedback

---

**Last Updated**: November 15, 2025
