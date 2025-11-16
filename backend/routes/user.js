const express = require('express')
const { verifyToken } = require('../middleware/auth')
const pool = require('../config/database')

const router = express.Router()

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const user = result.rows[0]

    // Get user stats
    const statsResult = await pool.query(
      'SELECT SUM(xp_earned) as totalXP, COUNT(*) as lessonsCompleted FROM user_progress WHERE user_id = $1',
      [req.userId]
    )

    const stats = statsResult.rows[0]

    res.json({
      ...user,
      totalXP: stats.totalxp || 0,
      lessonsCompleted: stats.lessonscount || 0,
      streak: 7 // TODO: Calculate from actual data
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name } = req.body

    const result = await pool.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [name, req.userId]
    )

    res.json({
      message: 'Profile updated',
      user: result.rows[0]
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
