# Root Level Setup Instructions

## Prerequisites
- Node.js v20+
- PostgreSQL 14+
- npm or yarn

## Project Structure
```
RISE-Foundation/
├── frontend/          # React Vite application
├── backend/           # Express.js API server
└── docs/             # Documentation
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npm run migrate
npm run seed
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Production Deployment

### Domain Configuration
- **Production Domain**: `http://quantumrisefoundation.org`
- **Frontend**: Hosted on Vercel/Netlify or custom server
- **Backend**: Hosted on Railway, Heroku, or custom VPS
- **Database**: PostgreSQL on managed service or VPS

### Environment Variables for Production

**Backend (.env)**:
```bash
DB_HOST=your-db-host.com
DB_USER=prod_user
DB_PASSWORD=secure_password
DB_NAME=quantumrise_prod
JWT_SECRET=very-secure-random-string
OPENAI_API_KEY=your-api-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://quantumrisefoundation.org
```

**Frontend (Vercel/Environment)**:
```bash
VITE_API_URL=https://api.quantumrisefoundation.org
```

## Key Features

✨ **AI-Powered Tutoring**: Claude API integration for 24/7 learning assistance
🎮 **Gamified Learning**: XP system, badges, and progress tracking
📚 **20+ Interactive Lessons**: Across 5 core disciplines
🔒 **Secure Authentication**: JWT-based user authentication
📊 **Analytics Dashboard**: Track progress and performance
👨‍💼 **Admin Panel**: Manage users, lessons, and platform settings

## 5 Core Disciplines
1. Mathematics
2. Physics
3. Computer Science
4. Engineering
5. Electronics

## Tech Stack

**Frontend**:
- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React Icons

**Backend**:
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Nodemailer

**AI Integration**:
- Anthropic Claude API

## Database Schema

The system automatically creates the following tables:
- `users` - User accounts and authentication
- `lessons` - Educational content
- `user_progress` - Track lesson completion and XP
- `badges` - Achievement badges
- `user_badges` - User earned badges

## Next Steps

### Development
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations and seed data
4. Start backend server
5. Start frontend development server
6. Access http://localhost:5173

### Production (quantumrisefoundation.org)
1. Set up production PostgreSQL database
2. Configure production environment variables
3. Build frontend: `npm run build`
4. Deploy frontend to Vercel/Netlify pointing to quantumrisefoundation.org
5. Deploy backend to Railway/Heroku with API endpoint
6. Configure DNS to point quantumrisefoundation.org to your hosting
7. Set up SSL/TLS certificate (automatic with most platforms)
8. Access https://quantumrisefoundation.org

## API Documentation

See `backend/README.md` for complete API documentation.

### API Endpoint (Production)
- Base URL: `https://api.quantumrisefoundation.org`
- All requests require JWT token in Authorization header
- See backend/README.md for detailed endpoint documentation

## Contributing

This is a educational platform. See LICENSE for usage terms.

---

Built for a better Future From Quantum Rise Foundation
