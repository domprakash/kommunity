const { db } = require('../config/firebase')
const { createError } = require('../middleware/errorHandler')
const { v4: uuidv4 } = require('uuid')

/**
 * GET /complaints — list complaints
 * Admin: all in community
 * Resident: own complaints + public complaints
 * Partner: own bookings
 */
async function listComplaints(req, res, next) {
  try {
    const { status, category, limit = 20 } = req.query
    const { communityId, uid, role } = req.user

    if (!communityId) {
      return next(createError(400, 'User is not part of a community'))
    }

    let query = db.collection('complaints')
      .where('communityId', '==', communityId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))

    // Residents only see their own + community complaints (not private ones)
    if (role === 'resident') {
      query = db.collection('complaints')
        .where('communityId', '==', communityId)
        .where('isPrivate', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(parseInt(limit))
    }

    const snapshot = await query.get()
    let complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Apply status filter (client-side after fetch since Firestore limits compound queries)
    if (status && status !== 'All') {
      complaints = complaints.filter(c => c.status === status)
    }
    if (category && category !== 'All') {
      complaints = complaints.filter(c => c.category === category)
    }

    res.json({ complaints, total: complaints.length })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /complaints — create complaint
 */
async function createComplaint(req, res, next) {
  try {
    const { title, description, category, isPrivate = false } = req.body

    if (!title || !description || !category) {
      return next(createError(400, 'title, description and category are required'))
    }

    const complaint = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      category,
      status: 'Open',
      isPrivate: Boolean(isPrivate),
      communityId: req.user.communityId,
      submittedBy: req.user.uid,
      submittedByName: req.user.displayName,
      apartment: req.user.apartment || null,
      upvotes: 0,
      upvotedBy: [],
      adminNote: null,
      resolvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await db.collection('complaints').doc(complaint.id).set(complaint)

    res.status(201).json({ message: 'Complaint submitted', complaint })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /complaints/:id — update complaint (admin: status/note; resident: upvote)
 */
async function updateComplaint(req, res, next) {
  try {
    const { id } = req.params
    const doc = await db.collection('complaints').doc(id).get()

    if (!doc.exists) {
      return next(createError(404, 'Complaint not found'))
    }

    const complaint = doc.data()

    if (complaint.communityId !== req.user.communityId) {
      return next(createError(403, 'Access denied'))
    }

    const updates = { updatedAt: new Date().toISOString() }

    if (req.user.role === 'admin') {
      // Admins can update status and note
      const { status, adminNote } = req.body
      const validStatuses = ['Open', 'In Progress', 'Resolved', 'Rejected']
      if (status && validStatuses.includes(status)) {
        updates.status = status
        if (status === 'Resolved') {
          updates.resolvedAt = new Date().toISOString()
        }
      }
      if (adminNote !== undefined) {
        updates.adminNote = adminNote
      }
    } else if (req.body.upvote) {
      // Residents can upvote
      const upvotedBy = complaint.upvotedBy || []
      if (upvotedBy.includes(req.user.uid)) {
        return next(createError(409, 'Already upvoted'))
      }
      updates.upvotes = (complaint.upvotes || 0) + 1
      updates.upvotedBy = [...upvotedBy, req.user.uid]
    } else {
      return next(createError(400, 'No valid update action'))
    }

    await db.collection('complaints').doc(id).update(updates)
    res.json({ message: 'Complaint updated', updates })
  } catch (err) {
    next(err)
  }
}

module.exports = { listComplaints, createComplaint, updateComplaint }
