# Backend API Setup Guide

## Prerequisites
- Node.js v20+
- PostgreSQL 14+ (local or remote)
- npm package manager

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quantumrise

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Claude API
CLAUDE_API_KEY=sk-xxx...

# Server
PORT=5000
NODE_ENV=development
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb quantumrise

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

## Development

### Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`
- Health check: `http://localhost:5000/health`

### Production Build
```bash
npm start
```

## Project Structure

```
backend/
├── routes/
│   ├── auth.js      # Authentication endpoints
│   ├── user.js      # User management
│   ├── lessons.js   # Lesson content
│   ├── tutor.js     # AI tutor integration
│   └── admin.js     # Admin functions
├── middleware/
│   └── auth.js      # JWT verification
├── config/
│   └── database.js  # PostgreSQL connection
├── db/
│   ├── schema.js    # Database schema
│   └── seed.js      # Initial data
├── server.js        # Main server file
└── package.json     # Dependencies
```

## API Endpoints

### Authentication (`/api/auth`)
```bash
POST /signup
  Body: { name, email, password }
  Returns: { token, user }

POST /login
  Body: { email, password }
  Returns: { token, user }
```

### User (`/api/user`)
```bash
GET /profile
  Headers: { Authorization: Bearer TOKEN }
  Returns: { user, stats }

PUT /profile
  Headers: { Authorization: Bearer TOKEN }
  Body: { name }
  Returns: { user }
```

### Lessons (`/api/lessons`)
```bash
GET /
  Returns: { lessons }

GET /:id
  Returns: { lesson }

GET /:id/progress
  Headers: { Authorization: Bearer TOKEN }
  Returns: { progress }

POST /:id/progress
  Headers: { Authorization: Bearer TOKEN }
  Body: { progress, completed }
  Returns: { progress }
```

### AI Tutor (`/api/tutor`)
```bash
POST /ask
  Headers: { Authorization: Bearer TOKEN }
  Body: { question, lessonId }
  Returns: { response }

GET /history/:lessonId
  Headers: { Authorization: Bearer TOKEN }
  Returns: { history }
```

### Admin (`/api/admin`)
```bash
GET /users (admin only)
  Returns: { users }

POST /lessons (admin only)
  Body: { title, description, discipline, level, xp_reward }
  Returns: { lesson }

GET /analytics (admin only)
  Returns: { analytics }
```

## Database Schema

### Table: users
- `id` - Primary key
- `name` - User name
- `email` - Unique email
- `password` - Hashed password
- `role` - 'student' or 'admin'
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Table: lessons
- `id` - Primary key
- `title` - Lesson title
- `description` - Description
- `discipline` - Subject area
- `level` - Difficulty level
- `content` - Lesson content
- `xp_reward` - XP points
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Table: user_progress
- `id` - Primary key
- `user_id` - Foreign key
- `lesson_id` - Foreign key
- `progress` - Completion % (0-100)
- `completed` - Boolean
- `xp_earned` - Points earned
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Additional Tables
- `badges` - Achievement definitions
- `user_badges` - User earned badges

## Authentication

### JWT Token Flow
1. User signs up/logs in
2. Server creates JWT with user data
3. Client stores token in localStorage
4. Client includes token in Authorization header
5. Middleware verifies token on protected routes

### Token Format
```
Authorization: Bearer eyJhbGc...
```

### Verification
```javascript
const token = req.headers.authorization?.split(' ')[1]
jwt.verify(token, JWT_SECRET)
```

## Error Handling

Standard error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error info"
}
```

HTTP Status Codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 409 - Conflict
- 500 - Server Error

## Security Features

✅ Password hashing (bcryptjs)
✅ JWT authentication
✅ Input validation
✅ CORS protection
✅ Helmet.js headers
✅ Rate limiting (planned)
✅ SQL injection prevention (parameterized queries)
✅ XSS protection

## Common Tasks

### Add New Endpoint
1. Create route in `routes/`
2. Use `verifyToken` middleware if protected
3. Register route in `server.js`

### Create New Lesson
```javascript
POST /api/admin/lessons
{
  "title": "Lesson Title",
  "description": "Description",
  "discipline": "Mathematics",
  "level": "Beginner",
  "content": "HTML content",
  "xp_reward": 100
}
```

### Query User Progress
```sql
SELECT * FROM user_progress
WHERE user_id = $1 AND lesson_id = $2
```

## Integration: Claude API

### Usage
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

### Features to Add
- Context awareness (lesson info)
- Response caching
- Conversation history
- Rate limiting
- Cost tracking

## Deployment

### Environment Variables
Set in production:
- DB_HOST - Remote database
- JWT_SECRET - Strong secret
- CLAUDE_API_KEY - API key
- NODE_ENV=production
- PORT - Listen port

### Process Manager
Use PM2 or similar:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Nginx Reverse Proxy
```nginx
upstream api {
  server localhost:5000;
}

server {
  listen 80;
  server_name api.quantumrise.org;
  
  location / {
    proxy_pass http://api;
  }
}
```

## Troubleshooting

### Database Connection Error
```
Check DB_* environment variables
Verify PostgreSQL is running
Test connection: psql -U postgres
```

### JWT Errors
```
Verify JWT_SECRET matches
Check token expiration
Ensure token is in Authorization header
```

### CORS Errors
```
Verify CORS is enabled in server.js
Check origin in frontend
```

## Next Steps

1. ✅ Set up database
2. ✅ Configure environment
3. ✅ Run migrations
4. ✅ Test endpoints
5. ⏳ Integrate Claude API
6. ⏳ Add rate limiting
7. ⏳ Deploy to production

---

See `../SETUP.md` for full project setup
