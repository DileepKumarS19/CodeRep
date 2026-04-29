# CodeRep

A full-stack competitive coding platform where developers practice algorithmic problems in a real browser-based IDE with sandboxed code execution.

![CodeRep](https://img.shields.io/badge/version-1.0-00b8a3?style=flat-square)
![Node](https://img.shields.io/badge/node-22.12+-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## What is CodeRep?

CodeRep is a LeetCode-style platform built from scratch. Users can browse 141 coding problems, write Java solutions in an in-browser Monaco editor, and get real-time verdicts powered by Docker-isolated test execution.

---

## Features

- **In-browser IDE** — Monaco Editor (same engine as VS Code) with syntax highlighting, multi-language support, and per-problem code persistence via localStorage
- **Real code execution** — User code runs inside isolated Docker containers with CPU, memory, and network limits
- **Real-time results** — WebSocket (Socket.IO) pushes execution results to the browser the moment Docker finishes — no polling
- **Job queue** — BullMQ queue with concurrency control prevents server overload under simultaneous submissions
- **Redis caching** — Problems list and per-user solved status cached in Redis with automatic cache invalidation on new accepted submissions
- **JWT authentication** — Signup, signin, protected routes with bcrypt password hashing and Zod validation
- **141 problems** — Scraped from Exercism's open-source problem specifications via GitHub API, with run/submit test suite split
- **Solved tracking** — Green checkmarks on problems you've already accepted, powered by submission history

---

## Architecture

### System design

```
┌─────────────────────┐         ┌──────────────────────────┐
│                     │  HTTP   │                          │
│   React Frontend    │◄───────►│   Express Backend        │
│   (Vite + Tailwind) │         │   (Node.js + Mongoose)   │
│                     │WebSocket│                          │
│   Monaco Editor     │◄───────►│   Socket.IO              │
└─────────────────────┘         └────────────┬─────────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          │                  │                  │
                    ┌─────▼──────┐   ┌───────▼──────┐   ┌──────▼──────┐
                    │            │   │              │   │             │
                    │  MongoDB   │   │    Redis     │   │   BullMQ    │
                    │  (Atlas)   │   │  (Cache +    │   │   Queue     │
                    │            │   │   Queue)     │   │             │
                    └────────────┘   └──────────────┘   └──────┬──────┘
                                                               │
                                                        ┌──────▼──────┐
                                                        │             │
                                                        │   Worker    │
                                                        │   Process   │
                                                        │             │
                                                        └──────┬──────┘
                                                               │
                                                        ┌──────▼──────┐
                                                        │             │
                                                        │   Docker    │
                                                        │  Container  │
                                                        │ (coderep-   │
                                                        │    java)    │
                                                        └─────────────┘
```

### Production deployment

```
Vercel          → hosts the React frontend
Render          → runs the Express API + Socket.IO WebSocket server
Upstash Redis   → manages the BullMQ job queue + caching layer
AWS EC2         → runs the worker process that pulls jobs and executes
                  user code in isolated Docker containers
MongoDB Atlas   → stores users, problems, and submission history
```

### Code execution flow

```
User submits code
      ↓
POST /api/execute → job added to BullMQ queue → jobId returned instantly
      ↓
Worker picks up job → writes .java files to /tmp/uuid/
      ↓
Docker container spins up (--network none, --memory 512m, --cpus 0.5)
      ↓
javac compiles → JUnit runs tests → stdout captured
      ↓
Worker parses output → saves submission to MongoDB → invalidates Redis cache
      ↓
Socket.IO emits result to user's private room → browser updates instantly
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Backend | Node.js, Express |
| Runtime | Bun |
| Database | MongoDB + Mongoose |
| Cache + Queue | Redis (IORedis + BullMQ) |
| Real-time | Socket.IO |
| Auth | JWT + bcrypt + Zod |
| Execution | Docker (openjdk:21) + JUnit 5 + AssertJ |
| Data source | Exercism problem specifications (GitHub API) |

---

## Project structure

```
CodeRep/
├── package.json        ← root scripts (dev:all, build)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   │   └── Problems.jsx
│   │   │   ├── LandingPage/
│   │   │   │   ├── Auth/Auth.jsx
│   │   │   │   ├── Body.jsx
│   │   │   │   └── LandingPage.jsx
│   │   │   ├── Navbar/
│   │   │   │   ├── NavbarWithAuth.jsx
│   │   │   │   └── NavbarWithoutAuth.jsx
│   │   │   ├── Solution/
│   │   │   │   ├── Ide.jsx
│   │   │   │   ├── ProblemDescription.jsx
│   │   │   │   └── SolutionPage.jsx
│   │   │   └── SolvedProblems/
│   │   │       └── SolvedProblems.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── backend/
    ├── db/
    │   ├── schema/
    │   │   ├── problemSchema.js
    │   │   ├── submissionSchema.js
    │   │   └── userSchema.js
    │   └── zod/
    │       └── zodValidation.js
    ├── scripts/
    │   └── seed.js
    ├── index.js        ← Express server + Socket.IO + BullMQ producer
    ├── worker.js       ← BullMQ worker + Docker executor
    └── package.json
```

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- [Node.js](https://nodejs.org) v22.12+
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [MongoDB Atlas](https://mongodb.com/atlas) account (free)
- [Redis](https://redis.io) running locally or [Upstash](https://upstash.com) account

### 1. Clone the repository

```bash
git clone https://github.com/DileepKumarS19/CodeRep.git
cd CodeRep
```

### 2. Build the Java Docker image

```bash
cd backend/docker/java
docker build -t coderep-java .

# verify
docker images | grep coderep-java
```

### 3. Set up environment variables

```bash
# backend
cd backend
cp .env.example .env
# open .env and fill in your values

# frontend
cd ../frontend
cp .env.example .env
# open .env and fill in your values
```

### 4. Install all dependencies

```bash
# from the project root
cd ..
bun install

# install backend and frontend dependencies
cd backend && bun install
cd ../frontend && bun install
```

### 5. Seed the database

```bash
cd backend
bun run scripts/seed.js
```

This fetches 141 problems from the Exercism GitHub repository and stores them in MongoDB with test suites, starter code, and execution limits.

### 6. Run the application

From the project root, start everything with one command:

```bash
bun run dev:all
```

This starts the backend API server, the BullMQ worker process, and the frontend dev server simultaneously.

Open `http://localhost:5173`

> **Prefer separate terminals?** Run each process individually:
> ```bash
> cd backend && bun run index.js   # Terminal 1 — API server
> cd backend && bun run worker.js  # Terminal 2 — Job worker
> cd frontend && bun run dev       # Terminal 3 — Frontend
> ```

---

## Environment variables

### Backend `.env`

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/coderep
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
SALT_ROUNDS=10

# Used to fetch problem descriptions and test cases from the
# Exercism problem-specifications GitHub repository during seeding.
# Without this, the seed script will be rate-limited by GitHub's API.
# Generate one at: https://github.com/settings/tokens
# Required scope: public_repo (read-only is sufficient)
GITHUB_TOKEN=ghp_your_github_personal_access_token

FRONTEND_URL=http://localhost:5173
PORT=3000
REDIS_URL=redis://localhost:6379
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## Root `package.json`

The root `package.json` enables running everything with a single command using `concurrently`:

```json
{
  "name": "coderep",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:all": "concurrently \"bun run --cwd backend index.js\" \"bun run --cwd backend worker.js\" \"bun run --cwd frontend dev\"",
    "build": "bun run --cwd frontend build"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

---

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/signup` | No | Create new account |
| POST | `/api/signin` | No | Login, returns JWT |
| GET | `/api/problems` | No | List all problems (Redis cached) |
| GET | `/api/problem/:slug` | No | Get single problem with starter code |
| POST | `/api/execute` | Yes | Queue code for execution, returns jobId |
| GET | `/api/submissions/solved` | Yes | Get list of accepted problem slugs |

---

## Security

- User code runs in Docker containers with `--network none` — no internet access
- CPU limited to 0.5 cores per submission
- Memory limited to 512MB per container
- Execution timeout of 10 seconds via Linux `timeout` command
- Temp files cleaned up after every execution
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 24 hours
- Rate limited to 10 submissions per minute per IP

---

## Performance

- Lighthouse desktop score: **80/100**
- Lighthouse best practices: **100/100**
- Initial JS bundle: **~44KB** (main chunk, gzipped ~16KB)
- Total bundle reduction: **65%** (from 890KB to 312KB)
- All pages lazy loaded — Monaco only downloads when a problem is opened
- Problems list cached in Redis for 1 hour
- Per-user solved status cached in Redis for 24 hours

---

## Roadmap

- [ ] Python and JavaScript execution support
- [ ] User profile page with submission history
- [ ] Problem filtering by topic/tag
- [ ] Leaderboard
- [ ] Contests
- [ ] Dark/light theme toggle
- [ ] Editorial solutions

---

## License

MIT — feel free to use this as a reference or learning resource.

---

## Author

Built by [Dileep Kumar](https://github.com/DileepKumarS19) — a full-stack coding platform built from scratch while learning the technologies used to build it.
