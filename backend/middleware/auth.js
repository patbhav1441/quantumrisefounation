const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(403).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    req.userId = decoded.id
    req.user = decoded
    next()
  })
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Admin access required' })
  }
}

module.exports = { verifyToken, isAdmin }
