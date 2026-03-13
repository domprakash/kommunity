# 🏘️ Kommunity — Community Super-App

> *The operating system for modern neighbourhoods*

A full-stack, production-ready web application built from a Figma Make design.
Mobile-first PWA for residential apartment communities.

---

## ✨ Features by Role

### 👤 Resident
- **Dashboard** — urgent announcements, quick actions, live stats, upcoming events, carpool today
- **Community** — notice board (with category filters), polls with live voting, complaint submission + tracking
- **Marketplace** — buy & sell listings, community events, parking slot rentals, interest clubs
- **Services** — trusted service provider directory + carpool matching (find rides / offer rides)
- **Profile** — TrustScore breakdown, achievement badges, wallet, activity stats

### 🏛️ RWA Admin
- **Analytics Overview** — revenue charts (Recharts), activity bar charts, complaint status pie chart
- **Resident Directory** — searchable list with trust scores
- **Complaint Workflow** — assign, update status, close
- **Voting System**, **Notice Board**, **Finance Dashboard**, **Marketplace Moderation**, **Reports**

### 🔧 Service Partner
- **Dashboard** — earnings chart, upcoming bookings, key stats
- **Bookings** — accept / decline + calendar view
- **Earnings**, **Reviews**, **Profile**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS |
| Routing | React Router v6 |
| State | Zustand (auth, UI, data stores) |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express.js |
| Database | Firebase Firestore |
| Auth | Firebase Auth (email/password + Google) |
| Storage | Firebase Storage |
| Hosting | Vercel (frontend) + Render (backend) |

---

## 📂 Project Layout

```
kommunity/
├── frontend/     ← React + Vite app
├── backend/      ← Express REST API
├── firebase/     ← Firestore rules + indexes
└── docs/         ← Setup & deployment guide
```

## 🚀 Get Started

See **[docs/SETUP.md](docs/SETUP.md)** for the complete step-by-step guide.

Quick start:
```bash
# Frontend
cd frontend && npm install && cp .env.example .env && npm run dev

# Backend (separate terminal)
cd backend && npm install && cp .env.example .env && npm run dev
```

---

*Designed in Figma Make · Built with the Kommunity stack*
