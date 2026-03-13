const { db } = require('../config/firebase')
const { createError } = require('../middleware/errorHandler')
const { v4: uuidv4 } = require('uuid')

/**
 * GET /announcements — list announcements for the user's community
 */
async function listAnnouncements(req, res, next) {
  try {
    const { limit = 20, category } = req.query
    const communityId = req.user.communityId

    if (!communityId) {
      return next(createError(400, 'User is not part of a community'))
    }

    let query = db.collection('announcements')
      .where('communityId', '==', communityId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))

    if (category && category !== 'All') {
      query = db.collection('announcements')
        .where('communityId', '==', communityId)
        .where('category', '==', category)
        .orderBy('createdAt', 'desc')
        .limit(parseInt(limit))
    }

    const snapshot = await query.get()
    const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    res.json({ announcements, total: announcements.length })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /announcements — create announcement (admin only)
 */
async function createAnnouncement(req, res, next) {
  try {
    const { title, body, category = 'General', urgent = false, expiresAt } = req.body

    if (!title || !body) {
      return next(createError(400, 'title and body are required'))
    }

    const announcement = {
      id: uuidv4(),
      title: title.trim(),
      body: body.trim(),
      category,
      urgent: Boolean(urgent),
      communityId: req.user.communityId,
      postedBy: req.user.uid,
      postedByName: req.user.displayName,
      likes: 0,
      createdAt: new Date().toISOString(),
      ...(expiresAt && { expiresAt }),
    }

    await db.collection('announcements').doc(announcement.id).set(announcement)

    res.status(201).json({ message: 'Announcement created', announcement })
  } catch (err) {
    next(err)
  }
}

/**
 * DELETE /announcements/:id — delete (admin only)
 */
async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params
    const doc = await db.collection('announcements').doc(id).get()

    if (!doc.exists) {
      return next(createError(404, 'Announcement not found'))
    }

    if (doc.data().communityId !== req.user.communityId) {
      return next(createError(403, 'Cannot delete announcements from another community'))
    }

    await db.collection('announcements').doc(id).delete()
    res.json({ message: 'Announcement deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { listAnnouncements, createAnnouncement, deleteAnnouncement }
