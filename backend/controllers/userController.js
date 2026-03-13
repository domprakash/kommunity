const { db } = require('../config/firebase')
const { createError } = require('../middleware/errorHandler')

/**
 * GET /users — list all users in same community (admin only)
 */
async function listUsers(req, res, next) {
  try {
    const { communityId, role } = req.query
    const targetCommunityId = communityId || req.user.communityId

    if (!targetCommunityId) {
      return next(createError(400, 'communityId is required'))
    }

    let query = db.collection('users').where('communityId', '==', targetCommunityId)
    if (role) query = query.where('role', '==', role)

    const snapshot = await query.orderBy('displayName').get()
    const users = snapshot.docs.map(doc => {
      const data = doc.data()
      // Omit sensitive fields from list view
      const { fcmToken, ...publicData } = data
      return { id: doc.id, ...publicData }
    })

    res.json({ users, total: users.length })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /users/:uid — get user profile
 * Admin gets full profile; resident gets public profile only
 */
async function getUser(req, res, next) {
  try {
    const { uid } = req.params
    const doc = await db.collection('users').doc(uid).get()

    if (!doc.exists) {
      return next(createError(404, 'User not found'))
    }

    const data = doc.data()

    // Check community scope
    if (req.user.role !== 'admin' && data.communityId !== req.user.communityId) {
      return next(createError(403, 'Access denied'))
    }

    const { fcmToken, email, ...publicProfile } = data
    const responseData = req.user.role === 'admin' || req.user.uid === uid
      ? { id: doc.id, ...data }
      : { id: doc.id, ...publicProfile }

    res.json(responseData)
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /users/:uid — update user profile (self or admin)
 */
async function updateUser(req, res, next) {
  try {
    const { uid } = req.params

    // Only allow self-edit or admin
    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return next(createError(403, 'Cannot edit another user\'s profile'))
    }

    const allowedFields = ['displayName', 'photoURL', 'apartment', 'phone', 'interests', 'bio']
    // Admins can also change role and communityId
    if (req.user.role === 'admin') {
      allowedFields.push('role', 'communityId', 'trustScore')
    }

    const updates = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return next(createError(400, 'No valid fields to update'))
    }

    updates.updatedAt = new Date().toISOString()
    await db.collection('users').doc(uid).update(updates)

    res.json({ message: 'Profile updated', uid, updates })
  } catch (err) {
    next(err)
  }
}

module.exports = { listUsers, getUser, updateUser }
