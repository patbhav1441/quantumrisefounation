# Deployment Guide

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] API rate limiting enabled
- [ ] Security headers configured
- [ ] Frontend build optimized
- [ ] Backend running on production
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] DNS configured

## Frontend Deployment

### Build Production Bundle
```bash
cd frontend
npm run build
```

Creates optimized `dist/` folder

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variable: `VITE_API_URL`

### Deploy to Static Host (AWS S3, etc)
```bash
# Build
npm run build

# Upload dist/ folder to host
# Configure routing for SPA
```

## Backend Deployment

### Heroku
```bash
heroku create quantumrise-api
heroku addons:create heroku-postgresql
git push heroku main
```

### Railway
1. Connect GitHub
2. Create PostgreSQL database
3. Set environment variables
4. Deploy automatically on push

### Raspberry Pi / VPS
```bash
# SSH into server
ssh user@ip

# Clone repository
git clone https://github.com/user/quantumrise.git
cd quantumrise/backend

# Install dependencies
npm install

# Create .env file
nano .env

# Run migrations
npm run migrate
npm run seed

# Start with PM2
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

## Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: quantumrise
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_USER: postgres
      DB_PASSWORD: password
      DB_NAME: quantumrise
      JWT_SECRET: your-secret
      CLAUDE_API_KEY: your-key

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

### Deploy with Docker
```bash
docker-compose up -d
```

## SSL/HTTPS Setup

### Let's Encrypt with Certbot
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name api.quantumrise.org;
    
    ssl_certificate /etc/letsencrypt/live/api.quantumrise.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.quantumrise.org/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.quantumrise.org;
    return 301 https://$server_name$request_uri;
}
```

## Environment Variables (Production)

### Backend (.env)
```env
NODE_ENV=production
PORT=5000

DB_USER=prod_user
DB_PASSWORD=strong_password_here
DB_HOST=db.example.com
DB_PORT=5432
DB_NAME=quantumrise_prod

JWT_SECRET=very_long_random_string_here_min_32_chars
JWT_EXPIRE=30d

CLAUDE_API_KEY=sk-...

# Email
EMAIL_USER=noreply@quantumrise.org
EMAIL_PASSWORD=app_password

# CORS
CORS_ORIGIN=https://app.quantumrise.org

# Logging
LOG_LEVEL=info
```

### Frontend (.env)
```env
VITE_API_URL=https://api.quantumrise.org/api
```

## Monitoring & Logging

### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 monit
```

### Logs Location
```
~/.pm2/logs/
```

### Uptime Monitoring
- Use UptimeRobot
- Monitor API health endpoint
- Set up alerts

## Backup Strategy

### Database Backup
```bash
# Daily backup to S3
pg_dump quantumrise_prod > backup-$(date +%Y%m%d).sql
aws s3 cp backup-$(date +%Y%m%d).sql s3://backups/

# Automated with cron
0 2 * * * pg_dump quantumrise_prod | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

### Restore Backup
```bash
psql quantumrise_prod < backup-20240115.sql
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer (nginx, HAProxy)
- Multiple API instances
- Shared PostgreSQL database
- Redis for caching

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching strategy

## Performance Optimization

### Frontend
```bash
# Analyze bundle
npm install --save-dev webpack-bundle-analyzer

# Minify assets
npm run build  # Already minified by Vite
```

### Backend
- Enable gzip compression
- Implement query caching
- Add database indexes
- Use connection pooling

### Database
```sql
-- Create indexes for common queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_lesson_discipline ON lessons(discipline);
CREATE INDEX idx_progress_user ON user_progress(user_id);
```

## Security in Production

✅ Use HTTPS only
✅ Set secure environment variables
✅ Enable CORS properly
✅ Use strong JWT secrets
✅ Implement rate limiting
✅ Keep dependencies updated
✅ Run security audits
✅ Log and monitor access
✅ Regular backups
✅ Incident response plan

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          mkdir ~/.ssh
          echo "${{ secrets.DEPLOY_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.HOST }} >> ~/.ssh/known_hosts
      - run: ssh user@${{ secrets.HOST }} 'cd app && git pull && npm install && npm run build'
```

## Troubleshooting Deployment

### Port Already in Use
```bash
lsof -ti:5000 | xargs kill -9
```

### Database Connection Issues
```bash
# Test connection
psql -h host -U user -d database

# Check environment variables
echo $DB_HOST
```

### Out of Memory
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=2048" npm start
```

## Rollback Plan

### Keep Previous Versions
```bash
git tag v1.0.0
git checkout v0.9.9
npm install
npm start
```

### Database Migration Rollback
```sql
-- Saved migration scripts
-- Run reverse scripts if needed
```

## Next Steps

1. Choose hosting provider
2. Set up domain & DNS
3. Configure SSL certificate
4. Deploy backend
5. Deploy frontend
6. Set up monitoring
7. Configure backups
8. Test in production
9. Monitor performance
10. Plan scaling strategy

---

See `BACKEND.md` and `FRONTEND.md` for service-specific guides
