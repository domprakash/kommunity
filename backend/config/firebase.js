const admin = require('firebase-admin')

let initialized = false

function initializeFirebase() {
  if (initialized) return admin

  let credential

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Option A: JSON string from environment variable (Render, Railway, etc.)
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      credential = admin.credential.cert(serviceAccount)
    } catch (err) {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON — must be valid JSON')
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // Option B: Local file path
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    credential = admin.credential.cert(serviceAccount)
  } else {
    throw new Error('Firebase credentials not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH')
  }

  admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  })

  initialized = true
  console.log('✅ Firebase Admin initialized')
  return admin
}

const firebaseAdmin = initializeFirebase()

module.exports = {
  admin: firebaseAdmin,
  auth: firebaseAdmin.auth(),
  db: firebaseAdmin.firestore(),
}
