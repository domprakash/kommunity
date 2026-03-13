const { auth, db } = require('../config/firebase')
const { createError } = require('./errorHandler')

/**
 * Verifies the Firebase ID token in Authorization header.
 * Attaches the full user profile from Firestore to req.user.
 */
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return next(createError(401, 'No token provided'))
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await auth.verifyIdToken(token)

    // Fetch full profile from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()

    if (!userDoc.exists) {
      return next(createError(404, 'User profile not found'))
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userDoc.data(),
    }

    next()
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return next(createError(401, 'Token expired'))
    }
    if (err.code === 'auth/argument-error' || err.code === 'auth/invalid-id-token') {
      return next(createError(401, 'Invalid token'))
    }
    next(err)
  }
}

/**
 * Role-based access guard. Call after verifyToken.
 * @param {...string} roles - allowed roles, e.g. requireRole('admin') or requireRole('admin', 'resident')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Not authenticated'))
    }
    if (!roles.includes(req.user.role)) {
      return next(createError(403, `Access denied. Required role: ${roles.join(' or ')}`))
    }
    next()
  }
}

module.exports = { verifyToken, requireRole }
