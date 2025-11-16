# OpenAI Integration Guide

## Overview

The Quantum Rise Foundation AI Tutor is now fully integrated with OpenAI's GPT-4 API. This provides intelligent, real-time educational support across all 5 disciplines.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install openai
```

The `openai` package (v4.24.0+) is already added to `package.json`.

### 2. Set Environment Variable

Add your OpenAI API key to `backend/.env`:

```env
OPENAI_API_KEY=sk-proj-YOUR_API_KEY_HERE
```

### 3. Restart Backend

```bash
npm run dev
```

## Features

### 1. Ask Questions
Students can ask any question about the lesson content.

**Endpoint:** `POST /api/tutor/ask`

```bash
curl -X POST http://localhost:5000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "question": "What is photosynthesis?",
    "lessonId": 1,
    "conversationHistory": []
  }'
```

**Response:**
```json
{
  "message": "Response generated successfully",
  "response": {
    "answer": "Photosynthesis is the process by which plants...",
    "usage": {
      "promptTokens": 125,
      "completionTokens": 256,
      "totalTokens": 381
    }
  }
}
```

### 2. Generate Practice Exercises

Get AI-generated practice problems for any topic.

**Endpoint:** `POST /api/tutor/exercises`

```bash
curl -X POST http://localhost:5000/api/tutor/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "topic": "Quadratic Equations",
    "level": "Intermediate"
  }'
```

### 3. Explain Concepts

Get detailed explanations with examples.

**Endpoint:** `POST /api/tutor/explain`

```bash
curl -X POST http://localhost:5000/api/tutor/explain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "concept": "Newton''s Second Law",
    "discipline": "Physics",
    "level": "Beginner"
  }'
```

### 4. Evaluate Answers

Get AI feedback on student responses.

**Endpoint:** `POST /api/tutor/evaluate`

```bash
curl -X POST http://localhost:5000/api/tutor/evaluate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "question": "What is the formula for kinetic energy?",
    "studentAnswer": "KE = 1/2 * m * v^2",
    "expectedAnswer": "KE = (1/2)mv² or KE = 0.5 * mass * velocity²",
    "discipline": "Physics"
  }'
```

### 5. Chat History

Retrieve all past conversations for a lesson.

**Endpoint:** `GET /api/tutor/history/:lessonId`

```bash
curl -X GET http://localhost:5000/api/tutor/history/1 \
  -H "Authorization: Bearer TOKEN"
```

## System Prompt

The AI Tutor uses this system prompt to maintain consistent, educational responses:

```
You are an expert AI tutor for the Quantum Rise Foundation educational platform. 
You help students learn across 5 core disciplines: Mathematics, Physics, Computer Science, 
Engineering, and Electronics.

Your responsibilities:
1. Explain complex concepts in simple, understandable language
2. Provide step-by-step solutions to problems
3. Give real-world examples and applications
4. Encourage critical thinking and exploration
5. Adapt explanations based on student level (Beginner, Intermediate, Advanced)
6. Be patient and supportive
```

## Database Storage

All tutor conversations are stored in the `tutor_conversations` table:

```sql
CREATE TABLE tutor_conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  lesson_id INTEGER,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
)
```

## Model Configuration

- **Model:** `gpt-4-turbo-preview` (GPT-4 Turbo)
- **Temperature:** 0.7 (for balanced creativity and accuracy)
- **Max Tokens:** 1500 (for comprehensive responses)
- **Top P:** 0.9 (for diverse but focused responses)

## Cost Estimation

### Pricing (As of Nov 2024)
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

### Example Costs
- Average Q&A: 400 tokens = ~$0.015
- Exercise Generation: 1000 tokens = ~$0.04
- Concept Explanation: 1500 tokens = ~$0.05

## Best Practices

### 1. Conversation Context
Always include `conversationHistory` for context-aware responses:

```javascript
const conversationHistory = [
  { role: 'user', text: 'What is photosynthesis?' },
  { role: 'assistant', text: 'Photosynthesis is...' },
  { role: 'user', text: 'Can you explain the light reactions?' }
]
```

### 2. Handle Long Conversations
For very long conversations, summarize history:

```javascript
// Keep recent messages + summary of old ones
const recentMessages = conversationHistory.slice(-5)
const summary = `Earlier we discussed the basic process of photosynthesis...`
```

### 3. Error Handling
Always handle API failures gracefully:

```javascript
try {
  const response = await fetch('/api/tutor/ask', { ... })
  if (!response.ok) {
    // Show user-friendly error
    console.error('AI Tutor unavailable. Please try again.')
  }
} catch (err) {
  // Network or timeout error
  console.error('Connection error:', err)
}
```

## Troubleshooting

### Issue: "Invalid API Key"
**Solution:** Verify the `OPENAI_API_KEY` in `.env` is correct and not expired.

### Issue: Rate Limit Error
**Solution:** Implement exponential backoff:

```javascript
async function askWithRetry(question, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await aiTutorService.askQuestion(question)
    } catch (err) {
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
      } else {
        throw err
      }
    }
  }
}
```

### Issue: Timeout
**Solution:** Increase timeout in fetch:

```javascript
const response = await fetch(url, {
  ...options,
  timeout: 60000 // 60 seconds
})
```

### Issue: High Token Usage
**Solution:** Limit conversation history:

```javascript
// Keep only last 10 messages
const limitedHistory = conversationHistory.slice(-10)
```

## Monitoring & Analytics

### Track Usage

```sql
SELECT 
  COUNT(*) as total_questions,
  SUM(tokens) as total_tokens,
  AVG(tokens) as avg_tokens_per_question
FROM tutor_conversations
WHERE created_at > NOW() - INTERVAL '1 day'
```

### Monitor Costs

```javascript
// In aiTutor.js
const totalCost = (
  (response.usage.prompt_tokens * 0.01 / 1000) +
  (response.usage.completion_tokens * 0.03 / 1000)
)
console.log(`Cost for this request: $${totalCost.toFixed(4)}`)
```

## Future Enhancements

1. **Streaming Responses:** Use OpenAI streaming for real-time answers
2. **Fine-Tuning:** Create custom models trained on course materials
3. **Embedding Search:** Use embeddings to find similar questions
4. **Voice Support:** Add speech-to-text for voice questions
5. **Multilingual Support:** Support questions in multiple languages
6. **Context Awareness:** Use lesson content in system prompt

## API Reference

All AI Tutor endpoints require:
- **Authentication:** JWT token in `Authorization` header
- **Content-Type:** `application/json`

### Request/Response Formats

**Success (200):**
```json
{
  "message": "Response generated successfully",
  "response": { ... },
  "feedback": { ... }
}
```

**Error (400/500):**
```json
{
  "message": "Error description",
  "error": "Detailed error info",
  "details": "Additional context"
}
```

## Support

For issues with OpenAI integration:
1. Check OpenAI API status: https://status.openai.com
2. Review API documentation: https://platform.openai.com/docs
3. Check token limits: https://platform.openai.com/account/billing/limits
4. Contact OpenAI support for account issues

---

**AI Tutor is now live and ready for students!** 🚀

For any questions, refer to the main documentation or check the code in `backend/services/aiTutor.js`.
