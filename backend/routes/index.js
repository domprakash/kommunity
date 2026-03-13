const { Router } = require('express')
const { verifyToken, requireRole } = require('../middleware/auth')
const { listUsers, getUser, updateUser } = require('../controllers/userController')
const { listAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController')
const { listComplaints, createComplaint, updateComplaint } = require('../controllers/complaintController')

const router = Router()

// ─── Users ───────────────────────────────────────────────────────────────────
// GET  /users          — list community users (admin only)
// GET  /users/:uid     — get user profile (any authenticated)
// PATCH /users/:uid    — update profile (self or admin)
router.get   ('/users',         verifyToken, requireRole('admin'),                    listUsers)
router.get   ('/users/:uid',    verifyToken,                                           getUser)
router.patch ('/users/:uid',    verifyToken,                                           updateUser)

// ─── Announcements ───────────────────────────────────────────────────────────
// GET    /announcements        — list (any authenticated)
// POST   /announcements        — create (admin only)
// DELETE /announcements/:id    — delete (admin only)
router.get   ('/announcements',       verifyToken,                            listAnnouncements)
router.post  ('/announcements',       verifyToken, requireRole('admin'),      createAnnouncement)
router.delete('/announcements/:id',   verifyToken, requireRole('admin'),      deleteAnnouncement)

// ─── Complaints ───────────────────────────────────────────────────────────────
// GET   /complaints        — list (admin: all; resident: community)
// POST  /complaints        — create (resident)
// PATCH /complaints/:id    — update status (admin) or upvote (resident)
router.get   ('/complaints',      verifyToken,                                      listComplaints)
router.post  ('/complaints',      verifyToken, requireRole('resident', 'admin'),    createComplaint)
router.patch ('/complaints/:id',  verifyToken,                                      updateComplaint)

module.exports = router
