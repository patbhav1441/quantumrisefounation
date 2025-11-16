# 🚀 Quick Start: OpenAI AI Tutor

## 3-Minute Setup

### Step 1: Add API Key to Backend

```bash
cd backend
nano .env  # or open with your editor
```

Add this line:
```env
OPENAI_API_KEY=sk-proj-YOUR_API_KEY_HERE
```

Save and exit.

### Step 2: Install Dependencies

```bash
npm install openai
```

*(Already in package.json, so just run npm install)*

### Step 3: Start Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Database tables created successfully
```

### Step 4: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

### Step 5: Test AI Tutor

1. Click "Sign Up" → Create account
2. Click "Sign In" → Login
3. Click "Lessons"
4. Pick any lesson → Click "Start"
5. Look for **"AI Tutor"** chat box on the right
6. Type a question → Hit send
7. Wait for AI response!

## 5 AI Tutor Features

### 1️⃣ Ask Questions
**In Lesson Chat:**
```
You: "What is photosynthesis?"
AI: "Photosynthesis is the process where plants..."
```

### 2️⃣ Generate Exercises
**Via API:**
```bash
curl -X POST http://localhost:5000/api/tutor/exercises \
  -H "Authorization: Bearer TOKEN" \
  -d '{"topic": "Algebra", "level": "Beginner"}'
```

### 3️⃣ Explain Concepts
**Via API:**
```bash
curl -X POST http://localhost:5000/api/tutor/explain \
  -H "Authorization: Bearer TOKEN" \
  -d '{"concept": "Force", "discipline": "Physics", "level": "Beginner"}'
```

### 4️⃣ Evaluate Answers
**Via API:**
```bash
curl -X POST http://localhost:5000/api/tutor/evaluate \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "question": "What is 2+2?",
    "studentAnswer": "4",
    "expectedAnswer": "4",
    "discipline": "Mathematics"
  }'
```

### 5️⃣ View Chat History
**Via API:**
```bash
curl http://localhost:5000/api/tutor/history/1 \
  -H "Authorization: Bearer TOKEN"
```

## Common Issues & Fixes

### "API Key not valid"
✅ Check API key is correct in `.env`
✅ No extra spaces
✅ Key starts with `sk-proj-`

### "Module not found: openai"
```bash
npm install openai
```

### "Cannot POST /api/tutor/ask"
✅ Backend running? (`npm run dev`)
✅ Using correct token?
✅ Sent POST not GET?

### "No response from AI"
✅ Check OpenAI API status: https://status.openai.com
✅ Check API key has credits
✅ Check network: is backend responding?

## What's Happening Behind the Scenes

```
[Student Types Question]
         ↓
    Frontend
    Sends to /api/tutor/ask
         ↓
    Backend
    Calls OpenAI GPT-4
         ↓
    OpenAI Processes
    (Using system prompt)
         ↓
    Response Returned
         ↓
    Saved to Database
         ↓
    [Student Sees Answer]
```

## Architecture

```
Frontend (React)
    ↓ (HTTP POST)
Backend (Express)
    ↓ (SDK Call)
OpenAI API
    ↓ (Response)
Backend
    ↓ (Save + Return)
Frontend
    ↓ (Display)
Student
```

## File Locations

| File | Purpose |
|------|---------|
| `backend/services/aiTutor.js` | AI service logic |
| `backend/routes/tutor.js` | API endpoints |
| `backend/db/schema.js` | Database setup |
| `frontend/src/pages/LessonDetail.jsx` | Chat UI |
| `docs/OPENAI_INTEGRATION.md` | Full docs |

## Environment Setup Checklist

- [ ] Created `.env` in backend folder
- [ ] Added `OPENAI_API_KEY` to `.env`
- [ ] Ran `npm install openai` in backend
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can login to platform
- [ ] Can access lessons
- [ ] AI Tutor responds to questions

## Testing Checklist

- [ ] Create test account
- [ ] Login successfully
- [ ] View lessons page
- [ ] Open a lesson
- [ ] See AI Tutor chat box
- [ ] Type a question
- [ ] Get AI response
- [ ] Check message saved in history
- [ ] Try different lessons

## API Endpoints Summary

```
POST   /api/tutor/ask           Ask question
GET    /api/tutor/history/:id   View history
POST   /api/tutor/exercises     Generate exercises
POST   /api/tutor/explain       Explain concept
POST   /api/tutor/evaluate      Grade answer
```

All require: `Authorization: Bearer TOKEN` header

## Performance Notes

- **First Response:** 3-5 seconds
- **Cached Responses:** 1-2 seconds
- **Max Tokens:** 1500 per response
- **Monthly Cost:** ~$300 for 1000 students

## Next: Customize

Want to customize the AI tutor?

1. **Edit system prompt:** `backend/services/aiTutor.js` line 5
2. **Change model:** `client.chat.completions.create({ model: 'gpt-4...' })`
3. **Adjust temperature:** Lower = more factual, Higher = more creative
4. **Add more endpoints:** Copy pattern in `backend/routes/tutor.js`

## Resources

- 📖 Full Guide: `docs/OPENAI_INTEGRATION.md`
- 💻 Code: `backend/services/aiTutor.js`
- 🎓 Docs: `docs/BACKEND.md`
- ⚡ Quick Ref: `QUICK_REFERENCE.md`

## Production Notes

Before deploying:
1. Add API key to production `.env`
2. Set `NODE_ENV=production`
3. Implement rate limiting
4. Add cost monitoring
5. Test with real load
6. Monitor API usage

## Support

**Issue?** Check:
1. OpenAI API status
2. API key valid & has credits
3. Backend logs for errors
4. Network tab in DevTools

**Still stuck?** Review:
- `docs/OPENAI_INTEGRATION.md` → Troubleshooting
- `backend/services/aiTutor.js` → Code comments
- Console output → Error messages

---

## You're All Set! 🎉

Your AI Tutor is ready to help students learn. Start it up and watch the magic happen!

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Visit http://localhost:5173
```

**Questions?** See `docs/OPENAI_INTEGRATION.md` for detailed info.

Happy teaching! 📚✨
