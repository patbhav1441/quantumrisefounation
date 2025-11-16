# Quantum Rise Foundation - Documentation

## Project Overview

Quantum Rise Foundation is a comprehensive AI-powered educational platform designed to make learning interactive, engaging, and accessible. The platform combines gamification, AI tutoring, and interactive lessons across 5 core disciplines.

## Features

### Core Features
- **AI-Powered Tutoring**: 24/7 learning assistance using Claude API
- **Interactive Lessons**: 20+ lessons across 5 disciplines
- **Gamified Learning**: XP system, badges, and achievement tracking
- **User Profiles**: Track progress, streaks, and performance
- **Admin Dashboard**: Manage users, content, and analytics
- **Mobile Responsive**: Works on all devices

### 5 Core Disciplines
1. **Mathematics** - Algebra, Equations, Calculus
2. **Physics** - Force, Motion, Quantum Mechanics
3. **Computer Science** - Programming, Web Dev, Algorithms
4. **Engineering** - Robotics, Design, Systems
5. **Electronics** - Circuits, Microcontrollers, Hardware

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build**: Vite

### Backend
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet.js
- **Logging**: Morgan

### AI Integration
- **Provider**: Anthropic Claude API
- **Purpose**: AI Tutor for Q&A and learning assistance

## Project Structure

```
RISE-Foundation/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind config
│   └── index.html          # HTML template
│
├── backend/                 # Express.js API server
│   ├── routes/             # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── user.js        # User routes
│   │   ├── lessons.js     # Lesson routes
│   │   ├── tutor.js       # AI tutor routes
│   │   └── admin.js       # Admin routes
│   ├── middleware/         # Custom middleware
│   ├── config/            # Configuration files
│   ├── db/                # Database schema & seed
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies
│   └── .env.example       # Environment template
│
├── SETUP.md               # Setup instructions
├── README.md              # Project overview
└── LICENSE                # MIT License
```

## Database Schema

### Users Table
```sql
- id (Primary Key)
- name
- email (Unique)
- password (hashed)
- role ('student' or 'admin')
- created_at
- updated_at
```

### Lessons Table
```sql
- id (Primary Key)
- title
- description
- discipline
- level ('Beginner', 'Intermediate', 'Advanced')
- content
- xp_reward
- created_at
- updated_at
```

### User Progress Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- lesson_id (Foreign Key)
- progress (0-100)
- completed (boolean)
- xp_earned
- created_at
- updated_at
```

### Badges Table
```sql
- id (Primary Key)
- name
- description
- icon
- criteria
- created_at
```

### User Badges Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- badge_id (Foreign Key)
- earned_at
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/lessons/:id/progress` - Get user progress
- `POST /api/lessons/:id/progress` - Update progress

### AI Tutor
- `POST /api/tutor/ask` - Ask tutor question
- `GET /api/tutor/history/:lessonId` - Get chat history

### Admin (requires admin role)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/lessons` - Create lesson
- `GET /api/admin/analytics` - Platform analytics

## Authentication Flow

1. **Signup/Login**: User creates account or logs in
2. **JWT Generation**: Server creates JWT token with user info
3. **Token Storage**: Client stores token in localStorage
4. **Authorization**: Each request includes token in Authorization header
5. **Token Verification**: Middleware verifies token on protected routes

## Gamification System

### XP (Experience Points)
- Awarded for completing lessons
- Points vary by lesson difficulty
- Accumulates in user profile

### Badges
- Earned by completing milestones
- Examples: First Steps, Quick Learner, Champion
- Display on user profile

### Progress Tracking
- Track lesson completion
- View discipline-specific progress
- Monitor learning streaks

## Development Workflow

### Adding a New Lesson
1. Create lesson in database
2. Add content and exercises
3. Set XP rewards
4. Test progression

### Creating Admin Features
1. Create route in `/api/admin/*`
2. Add `isAdmin` middleware check
3. Implement admin panel UI
4. Add analytics/management features

### Extending AI Tutor
1. Update Claude API integration
2. Add context awareness
3. Implement response caching
4. Add conversation history

## Security Considerations

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Input validation
- ✅ Helmet.js for security headers
- ✅ Rate limiting on auth routes
- ✅ Environment variables for secrets

## Performance Optimization

- Client-side routing for fast navigation
- Efficient database queries
- Caching strategy for lessons
- Lazy loading of components
- CDN-ready static assets

## Deployment Considerations

### Frontend
- Build with `npm run build`
- Deploy to: Netlify, Vercel, or static hosting
- Set `VITE_API_URL` environment variable

### Backend
- Ensure PostgreSQL is accessible
- Set all environment variables
- Run migrations before deployment
- Enable HTTPS in production

### Raspberry Pi Deployment
- 8GB RAM recommended
- Install Node.js v20+
- PostgreSQL or similar database
- Reverse proxy (nginx)
- SSL certificate (Let's Encrypt)

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Support & Contact

For questions or issues:
- Email: support@quantumrise.org
- Documentation: See docs/
- Issues: GitHub Issues

## License

MIT License - See LICENSE file

---

Built with ❤️ for Quantum Rise Foundation
Last Updated: 2024
