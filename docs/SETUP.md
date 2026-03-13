# Kommunity — Setup Guide

> The operating system for modern neighbourhoods
> React · Vite · TailwindCSS · Firebase · Node.js/Express

---

## Prerequisites

| Tool      | Version  |
|-----------|----------|
| Node.js   | ≥ 18.0   |
| npm       | ≥ 9.0    |
| Firebase CLI | latest |

---

## 1. Firebase Setup

### 1.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → Name it `kommunity` → Continue
3. Enable **Google Analytics** (optional)

### 1.2 Enable Authentication

1. Go to **Authentication → Sign-in method**
2. Enable **Email/Password**
3. Enable **Google**

### 1.3 Create Firestore Database

1. Go to **Firestore Database → Create database**
2. Choose **production mode**
3. Select a region close to your users (e.g., `asia-south1` for India)

### 1.4 Register a Web App

1. Go to **Project Settings → Your apps → Add app → Web**
2. Name it `kommunity-web`
3. Copy the config values — you'll need them in the next step

### 1.5 Get Service Account (for Backend)

1. Go to **Project Settings → Service accounts**
2. Click **Generate new private key**
3. Download the JSON file — keep it secret, never commit it

---

## 2. Frontend Setup

```bash
cd kommunity/frontend
cp .env.example .env
```

Edit `.env` and fill in your Firebase web config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_API_URL=http://localhost:3001
```

Install and run:

```bash
npm install
npm run dev
```

The frontend runs at **http://localhost:5173**

---

## 3. Backend Setup

```bash
cd kommunity/backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=3001
NODE_ENV=development

# Paste the full service account JSON as a single-line string:
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project",...}

FIREBASE_PROJECT_ID=your-project
ALLOWED_ORIGINS=http://localhost:5173
```

Install and run:

```bash
npm install
npm run dev
```

The API runs at **http://localhost:3001**
Health check: http://localhost:3001/health

---

## 4. Deploy Firestore Rules & Indexes

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login
firebase login

# Initialize in the project root
firebase init firestore
# Select your project → use existing rules and index files

# Deploy
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## 5. Create First Admin User

1. Sign up via the app's onboarding flow (this creates a `resident` account)
2. Go to Firebase Console → **Firestore → users collection**
3. Find your user document and change `role` from `"resident"` to `"admin"`
4. Sign out and sign back in — you'll now land on the Admin Dashboard

---

## 6. Database Schema

### `users` collection

```
{
  uid: string            // Firebase Auth UID (document ID)
  displayName: string
  email: string
  photoURL: string | null
  role: 'resident' | 'admin' | 'partner'
  communityId: string    // ID of their residential community
  apartment: string      // e.g. "Tower A, 404"
  trustScore: number     // 0–100
  interests: string[]
  fcmToken: string | null
  createdAt: ISO string
  updatedAt: ISO string
}
```

### `communities` collection

```
{
  id: string
  name: string
  address: string
  totalFlats: number
  adminIds: string[]
  inviteCode: string
  createdAt: ISO string
}
```

### `announcements` collection

```
{
  id: string
  title: string
  body: string
  category: 'Urgent' | 'General' | 'Reminder' | 'Event'
  urgent: boolean
  communityId: string
  postedBy: string      // UID
  postedByName: string
  likes: number
  createdAt: ISO string
  expiresAt?: ISO string
}
```

### `complaints` collection

```
{
  id: string
  title: string
  description: string
  category: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Rejected'
  isPrivate: boolean
  communityId: string
  submittedBy: string   // UID
  submittedByName: string
  apartment: string
  upvotes: number
  upvotedBy: string[]   // UIDs
  adminNote: string | null
  resolvedAt: ISO string | null
  createdAt: ISO string
  updatedAt: ISO string
}
```

---

## 7. Architecture

```
kommunity/
├── frontend/          # React + Vite + TailwindCSS
│   └── src/
│       ├── components/
│       │   ├── ui/        # Reusable UI components
│       │   └── layout/    # Shell layouts per role
│       ├── pages/
│       │   ├── resident/  # Home, Community, Marketplace, Services, Profile
│       │   ├── admin/     # Overview, Residents, Complaints
│       │   └── partner/   # Overview
│       ├── store/         # Zustand stores (auth, ui, data)
│       ├── services/      # Firebase Auth + Axios API client
│       ├── hooks/         # Custom React hooks (real-time Firestore)
│       └── types/         # TypeScript interfaces
│
├── backend/           # Node.js + Express
│   ├── config/        # Firebase Admin SDK init
│   ├── middleware/    # Token verification, role guard, error handler
│   ├── controllers/   # Business logic per resource
│   └── routes/        # Express router — all /api/v1/* endpoints
│
└── firebase/          # Firestore security rules + indexes
```

**Request flow:**
```
Browser → React SPA → Firebase Auth (get ID token)
                    → Axios (Bearer token) → Express API
                                           → Firebase Admin (verify token)
                                           → Firestore
```

---

## 8. Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Via Vercel CLI
npx vercel --prod
```

Set environment variables in Vercel dashboard (same as `.env`).

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build command**: `npm install`
5. **Start command**: `node server.js`
6. Add all environment variables from `backend/.env.example`

After deploying, update `VITE_API_URL` in Vercel to point to your Render URL.

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| `auth/invalid-api-key` | Check `VITE_FIREBASE_API_KEY` in frontend `.env` |
| `401 No token provided` | Ensure Axios interceptor is attaching the Bearer token |
| `403 Access denied` | Check user's `role` field in Firestore — must match expected role |
| Firestore rules rejecting reads | Ensure `communityId` is set on the user document |
| `CORS error` | Add your frontend URL to `ALLOWED_ORIGINS` in backend `.env` |
| `Firebase Admin not initialized` | Check `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON (use online JSON validator) |
| Page stuck on loading | Check browser console for Firestore permission errors |

---

## 10. Development Tips

- **Mock data**: All pages use realistic mock data by default — no Firebase connection required to view the UI
- **Role switching**: Change a user's `role` in Firestore to test different portals
- **TrustScore**: Update the `trustScore` field (0–100) in the user document to see badge colors change
- **Hot reload**: Both `npm run dev` processes support hot module replacement

---

*Built from Figma Make design — Kommunity v1.0*
