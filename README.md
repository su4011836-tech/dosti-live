# ZAKHMI MAHI

ZAKHMI MAHI is a premium social voice chat and entertainment platform built with React, TypeScript, Node.js, and PostgreSQL.

## Features

- **Voice Rooms:** Real-time voice chat with Agora/ZEGOCLOUD integration
- **Social Dashboard:** Interactive UI with beautiful animations and a dark premium theme
- **Games Center:** Playable games (Lucky Spin, Ludo, etc.)
- **Virtual Economy:** Virtual coins and gifts
- **VIP System:** Membership tiers and privileges

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Variables:**
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

5. **Database Setup:**
   Initialize your PostgreSQL database and run Prisma migrations:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

6. **Start the Backend Server:**
   ```bash
   npm run dev
   ```

## Development Guidelines

- Frontend code is inside the `/frontend` folder (React + Vite).
- Backend code is inside the `/backend` folder (Node.js + Express).
- Ensure environment variables are not committed. Use `.env.example` to track necessary keys.

## Deployment
Follow standard deployment procedures for Node.js apps and static frontend hosting (e.g., Vercel, Railway, Heroku).
