# Frontend Setup Guide

## Prerequisites
- Node.js v16+ (v20 recommended)
- npm or yarn package manager

## Installation

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Configure `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Development

### Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Main navigation
│   └── Footer.jsx      # Footer component
├── pages/
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration
│   ├── Dashboard.jsx   # User dashboard
│   ├── Lessons.jsx     # Lessons library
│   ├── LessonDetail.jsx # Single lesson
│   ├── AdminPanel.jsx  # Admin dashboard
│   └── NotFound.jsx    # 404 page
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Key Features

### Pages
1. **Home** - Landing page with features
2. **Auth** - Login/Signup forms
3. **Dashboard** - User progress tracking
4. **Lessons** - Browse all lessons
5. **Lesson Detail** - Interactive lesson with AI tutor
6. **Admin** - Admin management panel

### Components
- **Navbar** - Navigation with auth
- **Footer** - Site footer with links
- **AI Tutor Chat** - Interactive tutor in lessons
- **Progress Bars** - Visual progress tracking
- **Cards** - Reusable card components

## Styling

Using Tailwind CSS for styling. Key features:
- Dark theme (slate-900, slate-800)
- Blue/Purple gradients
- Responsive design
- Utility-first approach

## API Integration

All API calls go to `VITE_API_URL/api/*`

### Example:
```javascript
const response = await fetch('http://localhost:5000/api/lessons', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
```

## State Management

Currently using React hooks:
- `useState` - Local state
- Props for data passing
- localStorage for tokens

Future: Consider Redux or Context API for complex state.

## Common Tasks

### Add New Page
1. Create component in `pages/`
2. Add route in `App.jsx`
3. Import in App.jsx

### Add New Component
1. Create in `components/`
2. Export as default
3. Import where needed

### Make API Call
```javascript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch(`${VITE_API_URL}/endpoint`)
    .then(r => r.json())
    .then(d => setData(d))
    .finally(() => setLoading(false))
}, [])
```

## Debugging

### Debug Mode
```bash
# React DevTools
# Available as browser extension
```

### Console Logging
```javascript
console.log('Debug info', variable)
```

### Network Requests
Use browser DevTools > Network tab

## Performance Tips

- Lazy load pages with `React.lazy()`
- Use `useCallback` for expensive functions
- Optimize images
- Code splitting by route

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
Ensure backend CORS is configured:
```javascript
app.use(cors())
```

## Next Steps

1. Configure backend connection
2. Test authentication flow
3. Build custom pages
4. Integrate Claude API
5. Deploy to hosting

---

See `../SETUP.md` for full project setup
