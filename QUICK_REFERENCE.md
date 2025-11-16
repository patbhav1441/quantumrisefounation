# Quick Reference Guide

## 📋 Common Commands

### Frontend
```bash
cd frontend
npm install              # Install dependencies
npm run dev            # Start development server (port 5173)
npm run build          # Build for production
npm run preview        # Preview production build
```

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev            # Start with nodemon (port 5000)
npm start              # Start production server
npm run migrate        # Create database tables
npm run seed           # Populate initial data
```

## 🔐 Default Test Account (After Seeding)

The system will create a test admin account during seeding:
- Email: `admin@quantumrise.org`
- Password: `admin123` (change this in production!)

## 📝 Environment Setup

### Backend .env
```env
# Required for PostgreSQL
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quantumrise

# Required for authentication
JWT_SECRET=your-secret-key-min-32-chars

# Optional: Claude API
CLAUDE_API_KEY=sk-...

# Server
PORT=5000
```

### Frontend .env
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Key Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Authentication | ✅ Complete | `/api/auth` |
| User Profiles | ✅ Complete | `/api/user` |
| Lessons | ✅ Complete | `/api/lessons` |
| AI Tutor | ⏳ Ready (needs Claude) | `/api/tutor` |
| Admin Panel | ✅ Complete | `/api/admin` |
| Gamification | ✅ Framework | Database schema |
| Dashboard | ✅ Complete | Frontend |

## 🚀 Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
# API running on http://localhost:5000
```

### 2. Start Frontend (new terminal)
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### 3. Test Flow
1. Visit `http://localhost:5173`
2. Click "Sign Up" to create account
3. Fill in name, email, password
4. Login with credentials
5. Explore dashboard and lessons
6. Visit `/admin` (if admin role)

## 📊 Database Quick Reference

### View Tables
```sql
\dt  -- List all tables
\d users  -- Describe users table
SELECT * FROM users;
SELECT * FROM lessons;
```

### Add Test Data
```sql
INSERT INTO lessons (title, description, discipline, level, xp_reward) 
VALUES ('Test Lesson', 'Test Description', 'Mathematics', 'Beginner', 100);
```

## 🐛 Common Issues & Solutions

### Issue: Database Connection Failed
**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Verify .env credentials
cat backend/.env | grep DB_
```

### Issue: Port Already in Use
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue: CORS Error
**Solution:**
Ensure backend has CORS enabled (it does by default in server.js)

### Issue: Modules Not Found
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Testing Tools

### Using cURL
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Using Postman
1. Import API endpoints
2. Create auth collection
3. Set authorization token
4. Test each endpoint

## 🔄 File Organization

**Frontend Pages**: `frontend/src/pages/`
- Each page has corresponding route in `App.jsx`
- Pages import components from `frontend/src/components/`

**Backend Routes**: `backend/routes/`
- Each route file handles specific API endpoint
- All routes registered in `backend/server.js`

**Database**: `backend/db/`
- `schema.js` - Table definitions
- `seed.js` - Initial data

**Docs**: `docs/`
- Comprehensive guides for each aspect
- Use for reference during development

## 🎓 Learning Resources

### Frontend
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Vite: https://vitejs.dev

### Backend
- Express.js: https://expressjs.com
- PostgreSQL: https://www.postgresql.org
- JWT: https://jwt.io
- Node.js: https://nodejs.org

### AI Integration
- Claude API: https://anthropic.com/api
- Documentation: https://docs.anthropic.com

## 💾 Backup Commands

### Backup Database
```bash
pg_dump quantumrise > backup-$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql quantumrise < backup-20240115.sql
```

## 🚢 Deployment Checklist

Before deploying to production:
- [ ] All environment variables configured
- [ ] Database backed up
- [ ] SSL certificate obtained
- [ ] Frontend built (`npm run build`)
- [ ] Backend tested
- [ ] Documentation updated
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring set up
- [ ] Backup strategy in place

## 📞 Getting Help

1. **Check Documentation**: See `/docs` folder
2. **Review Comments**: Code has inline comments
3. **Check Error Messages**: Read console carefully
4. **Debug with DevTools**: Browser DevTools for frontend
5. **Check Logs**: `~/.pm2/logs/` for backend

## 🎯 Next: Claude AI Integration

When ready to integrate Claude:

1. Get API key from https://console.anthropic.com
2. Add to `.env`: `CLAUDE_API_KEY=sk-...`
3. Update `backend/routes/tutor.js` with actual API call
4. Test `/api/tutor/ask` endpoint
5. Update frontend to show real responses

**Example implementation** in `tutor.js`:
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: question
    }]
  })
})
```

---

**Keep this guide handy during development!**

For detailed information, see the docs/ folder.
