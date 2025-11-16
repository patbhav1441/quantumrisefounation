const OpenAI = require('openai')

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const systemPrompt = `You are an expert AI tutor for the Quantum Rise Foundation educational platform. 
You help students learn across 5 core disciplines: Mathematics, Physics, Computer Science, Engineering, and Electronics.

Your responsibilities:
1. Explain complex concepts in simple, understandable language
2. Provide step-by-step solutions to problems
3. Give real-world examples and applications
4. Encourage critical thinking and exploration
5. Adapt explanations based on student level (Beginner, Intermediate, Advanced)
6. Be patient and supportive

Always:
- Use clear, structured explanations
- Break down complex topics into smaller parts
- Ask clarifying questions if needed
- Suggest follow-up topics for deeper learning
- Provide practice problems when appropriate`

class AITutorService {
  constructor() {
    this.conversationHistory = new Map() // Store conversations per user
  }

  async askQuestion(userId, lessonId, question, conversationContext = []) {
    try {
      // Prepare messages with conversation history
      const messages = [
        ...conversationContext.map(msg => ({
          role: msg.role,
          content: msg.text || msg.content
        })),
        {
          role: 'user',
          content: question
        }
      ]

      // Make API call to OpenAI
      const response = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 0.9
      })

      const answer = response.choices[0].message.content

      return {
        success: true,
        answer: answer,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        }
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return {
        success: false,
        error: 'Failed to get AI response. Please try again.',
        details: error.message
      }
    }
  }

  async generateExerciseSuggestions(topic, level) {
    try {
      const prompt = `Generate 3 practice exercises for the topic "${topic}" at ${level} level. 
      Format as:
      Exercise 1: [question]
      Expected Difficulty: [easy/medium/hard]
      
      Exercise 2: [question]
      Expected Difficulty: [easy/medium/hard]
      
      Exercise 3: [question]
      Expected Difficulty: [easy/medium/hard]`

      const response = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educator creating practice problems.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })

      return {
        success: true,
        exercises: response.choices[0].message.content
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return {
        success: false,
        error: 'Failed to generate exercises',
        details: error.message
      }
    }
  }

  async explainConcept(concept, discipline, level) {
    try {
      const prompt = `Explain the concept of "${concept}" in ${discipline} at ${level} level.
      Include:
      1. Definition
      2. Key components
      3. Real-world example
      4. Why it matters
      5. Common misconceptions to avoid`

      const response = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })

      return {
        success: true,
        explanation: response.choices[0].message.content
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return {
        success: false,
        error: 'Failed to explain concept',
        details: error.message
      }
    }
  }

  async evaluateAnswer(question, studentAnswer, expectedAnswer, discipline) {
    try {
      const prompt = `Evaluate this student answer:
      
Question: ${question}
Student's Answer: ${studentAnswer}
Expected Answer: ${expectedAnswer}
Discipline: ${discipline}

Provide:
1. Correctness score (0-100)
2. What they got right
3. What needs improvement
4. Helpful tips
5. Suggested next steps`

      const response = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert evaluator providing constructive feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800
      })

      return {
        success: true,
        feedback: response.choices[0].message.content
      }
    } catch (error) {
      console.error('OpenAI API Error:', error)
      return {
        success: false,
        error: 'Failed to evaluate answer',
        details: error.message
      }
    }
  }
}

module.exports = new AITutorService()
