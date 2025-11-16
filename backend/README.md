# RISE Foundation Backend API

Environmental variables:
- `DB_USER`: PostgreSQL user (default: postgres)
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (default: quantumrise)
- `JWT_SECRET`: JWT secret key
- `OPENAI_API_KEY`: OpenAI API key for AI Tutor
- `PORT`: Server port (default: 5000)

## Setup

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `GET /api/lessons/:id/progress` - Get user progress
- `POST /api/lessons/:id/progress` - Update progress

### AI Tutor (OpenAI Integration)
- `POST /api/tutor/ask` - Ask AI tutor a question
- `GET /api/tutor/history/:lessonId` - Get chat history
- `POST /api/tutor/exercises` - Generate practice exercises
- `POST /api/tutor/explain` - Explain a concept
- `POST /api/tutor/evaluate` - Evaluate student answer

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/lessons` - Create lesson
- `GET /api/admin/analytics` - Get platform analytics
