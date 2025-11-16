# 🚀 Domain Deployment Checklist - quantumrisefoundation.org

## Quick Reference: Deploy in 5 Steps

### ✅ Step 1: Database (Choose One)
```bash
# Railway (easiest)
1. Go to https://railway.app
2. Create PostgreSQL project
3. Copy DATABASE_URL

# OR Heroku
1. heroku create quantumrise-api
2. heroku addons:create heroku-postgresql:standard-0
3. heroku config:get DATABASE_URL
```

### ✅ Step 2: DNS Records (Registrar)
Add these CNAME records to your registrar (GoDaddy, Namecheap, etc.):

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel.com |
| CNAME | api | your-backend-domain |
| MX | @ | your-email-provider |

### ✅ Step 3: Frontend (Vercel)
```bash
1. Go to https://vercel.com
2. Click "Import Project" → Select GitHub repo
3. Set Framework to "Vite"
4. Set Root Directory to "frontend"
5. Add Environment Variable:
   VITE_API_URL=https://api.quantumrisefoundation.org
6. Click "Deploy"
7. Add domain: Settings → Domains → Add "quantumrisefoundation.org"
```

### ✅ Step 4: Backend (Railway/Heroku)
```bash
# Railway
1. Click "Add Service" → GitHub Repo
2. Select RISE-Fondation
3. Set root to "backend"
4. Add Environment Variables:
   DATABASE_URL=your-postgresql-url
   JWT_SECRET=generate-strong-secret
   OPENAI_API_KEY=sk-proj-...
   NODE_ENV=production
   FRONTEND_URL=https://quantumrisefoundation.org

# OR Heroku
git subtree push --prefix backend heroku main
heroku config:set JWT_SECRET=your-secret
heroku config:set OPENAI_API_KEY=sk-proj-...
```

### ✅ Step 5: Verify & Go Live
```bash
# Test frontend
https://quantumrisefoundation.org

# Test backend
https://api.quantumrisefoundation.org/health

# Test database
Login → Should work without errors
```

---

## 🔑 Production Environment Variables

### Backend (.env)
```bash
# Database
DB_HOST=your-railway-host
DB_USER=postgres
DB_PASSWORD=auto-generated
DB_PORT=5432
DB_NAME=quantumrise_prod

# API Keys
JWT_SECRET=your-super-secure-random-string-min-32-chars
OPENAI_API_KEY=sk-proj-xhPRRt_NbNk...

# Domain URLs
FRONTEND_URL=https://quantumrisefoundation.org
API_URL=https://api.quantumrisefoundation.org

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (Vercel Environment)
```bash
VITE_API_URL=https://api.quantumrisefoundation.org
```

---

## 📍 Domain Structure

```
quantumrisefoundation.org          → Frontend (Vercel)
  ↓
api.quantumrisefoundation.org      → Backend API (Railway/Heroku)
  ↓
PostgreSQL Database                → Railway/Heroku/Custom
```

---

## 🧪 Testing Checklist

After deployment:

- [ ] Can load https://quantumrisefoundation.org
- [ ] SSL certificate shows (green lock icon)
- [ ] Can create account (sign up)
- [ ] Can login
- [ ] Can access dashboard
- [ ] Can view lessons
- [ ] AI Tutor responds to questions
- [ ] See "Server is running" at /health endpoint
- [ ] No CORS errors in console
- [ ] Mobile responsive

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| 404 Not Found | Check backend is deployed and running |
| CORS Error | Update CORS_ORIGIN in backend .env |
| Blank Page | Check frontend build succeeded |
| DB Connection Failed | Verify DATABASE_URL is correct |
| API Timeout | Increase timeout in deployment settings |
| SSL Error | Wait for certificate (up to 24 hours) |

---

## 📊 Monitoring

**Check Status**:
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard
- Health: https://api.quantumrisefoundation.org/health

**View Logs**:
- Railway: Click project → Logs tab
- Heroku: `heroku logs --tail`
- Vercel: Deployments → View logs

---

## 🔐 Security Reminders

Before launch:
- [ ] JWT_SECRET is long & random (32+ chars)
- [ ] Never commit .env file
- [ ] OPENAI_API_KEY is secret
- [ ] Database password is strong
- [ ] CORS configured for production only
- [ ] NODE_ENV=production
- [ ] HTTPS enabled

---

## 🎯 Post-Launch

1. **Analytics**: Add Google Analytics to frontend
2. **Admin**: Create first admin user
3. **Content**: Add real lesson content
4. **Monitoring**: Set up uptime alerts
5. **Backups**: Enable database backups
6. **Feedback**: Create feedback form

---

**Ready to deploy?**
1. ✅ Commit your changes to GitHub
2. ✅ Set up Vercel & Railway projects
3. ✅ Add DNS records
4. ✅ Deploy!

Questions? See DEPLOYMENT_GUIDE.md for detailed instructions.
