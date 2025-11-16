# 🌟 Quantum Rise Foundation Educational Platform

**Empowering minds, shaping futures**

A world-class educational platform featuring AI tutors, interactive simulations, and gamified learning across 5 core disciplines.

![Platform](https://img.shields.io/badge/platform-Raspberry%20Pi%205-red)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

## 🚀 Quick Start

### Option 1: Local Development
```bash
# Clone repository
git clone https://github.com/bmarimuthu-docker/RISE-Fondation.git
cd RISE-Fondation

# Backend setup
cd backend && npm install && cp .env.example .env
# Edit .env with your database credentials
npm run migrate && npm run seed && npm run dev

# Frontend setup (new terminal)
cd frontend && npm install && npm run dev
```

### Option 2: Docker Deployment
```bash
docker-compose up -d
```

See [SETUP.md](SETUP.md) for detailed instructions.

## ✨ Features

- 🎓 **20+ interactive lessons** across 5 subjects
- 🤖 **AI tutor** powered by Claude API (24/7 learning assistance)
- 📊 **Progress tracking** with XP and badges
- 🎮 **Gamified learning** experience
- 🌙 **Dark mode** with modern UI
- 📱 **Mobile responsive** design
- 🔒 **Secure authentication** with JWT
- 📧 **Email notifications** (ready to integrate)
- 👨‍💼 **Admin panel** for content management
- 🚀 **Optimized performance** with Vite

## 📚 5 Core Disciplines

1. **Mathematics** - Algebra, Equations, Calculus
2. **Physics** - Force, Motion, Quantum Mechanics  
3. **Computer Science** - Programming, Web Dev, Algorithms
4. **Engineering** - Robotics, Design, Systems
5. **Electronics** - Circuits, Microcontrollers, Hardware

## 🛠 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Lucide Icons

**Backend:**
- Node.js (v20+)
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs Password Hashing

**AI:**
- Anthropic Claude API
- Natural language Q&A

**Deployment:**
- Raspberry Pi 5 (8GB)
- Docker support
- Vercel/Netlify ready

## 📖 Documentation

- **[Setup Guide](SETUP.md)** - How to set up the project
- **[Project Overview](docs/PROJECT.md)** - Detailed project info
- **[Frontend Guide](docs/FRONTEND.md)** - Frontend development
- **[Backend Guide](docs/BACKEND.md)** - Backend API documentation
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Luiz Guzman / System Tech Works LLC** - Raspberry Pi & Arduino modules
- **Anthropic Claude** - AI Tutor functionality
- **React Team** - Frontend framework
- **Node.js Community** - Backend runtime

---

**Built with ❤️ for Quantum Rise Foundation**

Last Updated: November 2024
