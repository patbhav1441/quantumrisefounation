const express = require('express')
const { verifyToken } = require('../middleware/auth')
const pool = require('../config/database')

const router = express.Router()

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, discipline, level, xp_reward, created_at FROM lessons ORDER BY discipline, level'
    )

    res.json({
      lessons: result.rows
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lessons WHERE id = $1',
      [req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    res.json({
      lesson: result.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get user's lesson progress
router.get('/:id/progress', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
      [req.userId, req.params.id]
    )

    if (result.rows.length === 0) {
      return res.json({ progress: 0, completed: false })
    }

    res.json({
      progress: result.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Update lesson progress
router.post('/:id/progress', verifyToken, async (req, res) => {
  try {
    const { progress, completed } = req.body

    const result = await pool.query(
      'INSERT INTO user_progress (user_id, lesson_id, progress, completed, updated_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (user_id, lesson_id) DO UPDATE SET progress = $3, completed = $4, updated_at = NOW() RETURNING *',
      [req.userId, req.params.id, progress, completed]
    )

    res.json({
      message: 'Progress updated',
      progress: result.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
