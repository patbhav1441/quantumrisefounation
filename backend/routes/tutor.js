const express = require('express')
const { verifyToken } = require('../middleware/auth')
const aiTutorService = require('../services/aiTutor')
const pool = require('../config/database')

const router = express.Router()

// Chat with AI Tutor
router.post('/ask', verifyToken, async (req, res) => {
  try {
    const { question, lessonId, conversationHistory } = req.body

    if (!question) {
      return res.status(400).json({ message: 'Question is required' })
    }

    // Get AI response
    const result = await aiTutorService.askQuestion(
      req.userId,
      lessonId,
      question,
      conversationHistory || []
    )

    if (!result.success) {
      return res.status(500).json({ message: result.error, details: result.details })
    }

    // Save conversation to database
    if (lessonId) {
      await pool.query(
        `INSERT INTO tutor_conversations (user_id, lesson_id, question, answer, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [req.userId, lessonId, question, result.answer]
      )
    }

    res.json({
      message: 'Response generated successfully',
      response: {
        answer: result.answer,
        usage: result.usage
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get tutor chat history
router.get('/history/:lessonId', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT question, answer, created_at FROM tutor_conversations
       WHERE user_id = $1 AND lesson_id = $2
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.userId, req.params.lessonId]
    )

    res.json({
      history: result.rows.reverse() // Return in chronological order
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Generate exercise suggestions
router.post('/exercises', verifyToken, async (req, res) => {
  try {
    const { topic, level } = req.body

    if (!topic || !level) {
      return res.status(400).json({ message: 'Topic and level are required' })
    }

    const result = await aiTutorService.generateExerciseSuggestions(topic, level)

    if (!result.success) {
      return res.status(500).json({ message: result.error })
    }

    res.json({
      message: 'Exercises generated',
      exercises: result.exercises
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Explain a concept
router.post('/explain', verifyToken, async (req, res) => {
  try {
    const { concept, discipline, level } = req.body

    if (!concept || !discipline || !level) {
      return res.status(400).json({ message: 'Concept, discipline, and level are required' })
    }

    const result = await aiTutorService.explainConcept(concept, discipline, level)

    if (!result.success) {
      return res.status(500).json({ message: result.error })
    }

    res.json({
      message: 'Explanation generated',
      explanation: result.explanation
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Evaluate student answer
router.post('/evaluate', verifyToken, async (req, res) => {
  try {
    const { question, studentAnswer, expectedAnswer, discipline } = req.body

    if (!question || !studentAnswer || !expectedAnswer || !discipline) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const result = await aiTutorService.evaluateAnswer(
      question,
      studentAnswer,
      expectedAnswer,
      discipline
    )

    if (!result.success) {
      return res.status(500).json({ message: result.error })
    }

    res.json({
      message: 'Evaluation complete',
      feedback: result.feedback
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
