# Flowboard

A real-time collaborative Kanban board app. 

**[flowboard-steel.vercel.app](https://flowboard-steel.vercel.app)**

> The backend is hosted on Render's free tier = it make wake a few seconds to wake up on first load.


## Features

- Create, and delete boards, lists. and cards
- Drag and drop cards between lists
- Real-time collaboration - changes sync instantly across all connected users with live mouse tracking
- Authentication via Clerk
- Each user has their own board

## Tech Stack

**Frontend**
- React + TypeScript
- Clerk for authentication

**Backend**
- Node.js + Express
- Supabase (PostgreSQL)
- Socket.io for real-time events
- Clerk for auth middleware


## Screenshots

| Boards | Board View |
|--------|------------|
| <img width="1168" height="816" alt="image" src="https://github.com/user-attachments/assets/d625426c-07f9-4e3c-a421-796dbc5d020a" /> | <img width="1169" height="907" alt="image" src="https://github.com/user-attachments/assets/867397ea-11cc-40a9-bc85-23843daf5418" />|

## Getting Started
 
### Prerequisites
 
- Node.js 18+
- PostgreSQL
- A [Clerk](https://clerk.com) account

## Setup

### 1. Clone the repository
```
git clone https://github.com/jconst02/flowboard.git
cd flowboard
```

### 2. Set up the backend:
```
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
DATABASE_URL=your_supabase_connection_string
FRONTEND_URL=http://localhost:5173
CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
```

Start the server:

```
npm run dev
```

### 3. Set up the frontend
 
```
cd frontend
npm install
```
 
Create a `.env` file in `/frontend`:
 
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
VITE_API_URL=http://localhost:3000
```
 
Start the frontend:
 
```bash
npm run dev
```
 
 
## Environment Variables
 
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Clerk secret key (backend) |
| `VITE_API_URL` | Backend API URL |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (frontend) |
 


