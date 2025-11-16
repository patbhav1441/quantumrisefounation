require('dotenv').config()
const pool = require('../config/database')
const { createTables } = require('./schema')

const seedDatabase = async () => {
  try {
    // Create tables first
    await createTables()

    // Seed lessons
    const lessons = [
      {
        title: 'Algebra Basics',
        description: 'Learn the fundamentals of algebra',
        discipline: 'Mathematics',
        level: 'Beginner',
        xp_reward: 100
      },
      {
        title: 'Advanced Equations',
        description: 'Master complex algebraic equations',
        discipline: 'Mathematics',
        level: 'Intermediate',
        xp_reward: 250
      },
      {
        title: 'Calculus Fundamentals',
        description: 'Introduction to calculus concepts',
        discipline: 'Mathematics',
        level: 'Advanced',
        xp_reward: 500
      },
      {
        title: 'Force and Motion',
        description: 'Understand Newton\'s laws',
        discipline: 'Physics',
        level: 'Beginner',
        xp_reward: 150
      },
      {
        title: 'Quantum Mechanics',
        description: 'Explore the quantum world',
        discipline: 'Physics',
        level: 'Advanced',
        xp_reward: 600
      },
      {
        title: 'Python Basics',
        description: 'Introduction to Python programming',
        discipline: 'Computer Science',
        level: 'Beginner',
        xp_reward: 200
      },
      {
        title: 'Web Development',
        description: 'Build modern web applications',
        discipline: 'Computer Science',
        level: 'Intermediate',
        xp_reward: 350
      },
      {
        title: 'Robotics Intro',
        description: 'Get started with robotics',
        discipline: 'Engineering',
        level: 'Beginner',
        xp_reward: 180
      },
      {
        title: 'Circuit Design',
        description: 'Design and build circuits',
        discipline: 'Electronics',
        level: 'Intermediate',
        xp_reward: 280
      },
      {
        title: 'Microcontrollers',
        description: 'Program microcontrollers',
        discipline: 'Electronics',
        level: 'Advanced',
        xp_reward: 450
      }
    ]

    for (const lesson of lessons) {
      await pool.query(
        'INSERT INTO lessons (title, description, discipline, level, xp_reward) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [lesson.title, lesson.description, lesson.discipline, lesson.level, lesson.xp_reward]
      )
    }

    console.log('✅ Database seeded successfully')
  } catch (err) {
    console.error('❌ Error seeding database:', err)
  } finally {
    pool.end()
  }
}

seedDatabase()
