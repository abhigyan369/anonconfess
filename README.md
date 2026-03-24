# 🎭 AnonConfess

**Anonymous confession platform** — share, react, and comment without revealing your identity.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.io |

---

## Project Structure

```
anonymous_app/
├── server/               # Express + TypeScript backend
│   ├── src/
│   │   ├── config/       # DB connection, Socket.io
│   │   ├── models/       # Confession, Comment, Report schemas
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # Express routers
│   │   ├── middlewares/  # Error handler, rate limiter
│   │   ├── services/     # Profanity filter, trending score
│   │   ├── app.ts        # Express app
│   │   └── server.ts     # HTTP + Socket.io entry point
│   └── .env
│
└── client/               # Next.js frontend
    └── src/
        ├── app/          # Pages (Home, /confession/[id], /admin)
        ├── components/   # Navbar, ConfessionCard, ReactionBar, etc.
        ├── store/        # Zustand store
        ├── lib/          # API client, Socket.io client
        └── utils/        # anonymousId, timeFormat
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd server
cp .env.example .env   # Edit MongoDB URI, ADMIN_SECRET
npm install
npm run dev            # Runs at http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.local .env.local   # Already pre-filled for local dev
npm install
npm run dev                 # Runs at http://localhost:3000
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/confessions` | List confessions (`?page=&limit=&tag=&sort=trending`) |
| `POST` | `/api/confessions` | Create confession |
| `GET` | `/api/confessions/:id` | Get single confession |
| `GET` | `/api/comments/:confessionId` | Get comments |
| `POST` | `/api/comments` | Add comment |
| `POST` | `/api/reactions` | React to confession |
| `POST` | `/api/reports` | Report a confession |
| `GET` | `/api/admin/reports` | Admin: list reports (requires `x-admin-secret` header) |
| `PATCH` | `/api/admin/reports/:id` | Admin: resolve report |
| `DELETE` | `/api/admin/confessions/:id` | Admin: delete confession |

---

## Key Features

- 🔒 **Zero-login anonymity** — `User_XXXXXX` IDs stored in localStorage
- ❤️😢😮 **3-type reaction system** — one reaction per user per confession (toggle/switch)
- 💬 **Real-time comments** — Socket.io confession rooms
- 🔥 **Trending algorithm** — `score = (reactions×3 + comments) / (age_hours + 2)^1.5`
- 🚫 **Profanity filter** — blocks inappropriate content on create/comment
- 📊 **Moderation panel** — admin `/admin` page to view and resolve reports
- ⏱️ **Rate limiting** — 10 confessions/hour, 20 comments/10min per IP

---

## Environment Variables

### server/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/anonconfess
CLIENT_URL=http://localhost:3000
ADMIN_SECRET=your-secret-admin-key
NODE_ENV=development
```

### client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_ADMIN_SECRET=your-secret-admin-key
```
