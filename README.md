# TeamFlow — Team Task Manager

<div align="center">

![TeamFlow Logo](https://img.shields.io/badge/TeamFlow-Task%20Manager-6366f1?style=for-the-badge&logo=checkmarx&logoColor=white)

**A production-ready, full-stack Team Task Manager built for modern software teams.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app/)

[Live Demo](#) · [Report Bug](https://github.com/yourusername/team-task-manager/issues) · [Request Feature](https://github.com/yourusername/team-task-manager/issues)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Database Migration](#-database-migration)
- [Running Locally](#-running-locally)
- [Railway Deployment](#-railway-deployment)
- [API Endpoints](#-api-endpoints)
- [Folder Structure](#-folder-structure)
- [Demo Instructions](#-demo-instructions)

---

## 🎯 Project Overview

**TeamFlow** is a full-stack Team Task Manager designed for software development teams. It provides a centralized platform for project management, task tracking, and team collaboration. Built with a professional SaaS-grade UI and a robust RESTful API, TeamFlow is suitable for submission as a production-grade hiring assignment.

---

## ✨ Features

### Authentication & Authorization
- ✅ Secure signup with name, email, password validation
- ✅ JWT-based authentication (7-day expiry)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Role-based access control (Admin / Member)
- ✅ Protected routes on both frontend and backend

### Project Management
- ✅ Create, edit, and delete projects (Admin only)
- ✅ Invite team members by user ID
- ✅ Assign per-project roles (Admin / Member)
- ✅ Project completion percentage tracking
- ✅ Member management within projects

### Task Management
- ✅ Full task CRUD with title, description, priority, due date
- ✅ Assign tasks to project members
- ✅ Kanban board with 4 status columns
- ✅ Filter by status, priority, and assignee
- ✅ Search tasks by title
- ✅ Overdue task highlighting
- ✅ Sort by due date

### Dashboard & Analytics
- ✅ Stats cards: Total Projects, Tasks, Completed, Pending, Overdue, Assigned to Me
- ✅ Task distribution pie chart (by status)
- ✅ Recent activity feed
- ✅ Upcoming deadlines widget
- ✅ Completion percentage

### UI/UX
- ✅ Professional dark SaaS theme (Slate/Indigo palette)
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Toast notifications
- ✅ Confirmation modals
- ✅ Loading skeletons and empty states
- ✅ Sidebar navigation with active states
- ✅ Breadcrumb navigation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form + Zod validation |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Drag & Drop** | @dnd-kit |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js, TypeScript |
| **ORM** | Prisma v5 |
| **Database** | PostgreSQL |
| **Auth** | JWT + bcrypt |
| **Validation** | Zod |
| **Security** | Helmet, CORS, express-rate-limit |
| **Deployment** | Railway |

---

## 📸 Screenshots

> **Dashboard** — Stats overview, charts, and recent activity
> *(Add screenshot here)*

> **Projects** — Project grid with completion bars
> *(Add screenshot here)*

> **Project Detail** — Kanban board with task management
> *(Add screenshot here)*

> **Task Detail** — Full task information with inline editing
> *(Add screenshot here)*

---

## 🚀 Local Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14 (local instance or cloud)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

Copy the example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/teamflow` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-key-min-32-chars` |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## 🗄 Database Migration

### Development

```bash
cd backend

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed demo data
npm run seed
```

### Production (Railway)

Railway runs migrations automatically on deploy via `prisma migrate deploy` in the build step. See [Railway Deployment](#-railway-deployment).

---

## 💻 Running Locally

### Option A: Two Terminals (Recommended for Development)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Vite dev server starts on http://localhost:3000
# API calls are proxied to http://localhost:5000
```

Open your browser at **http://localhost:3000**

### Demo Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `password123` |
| Member | `member@demo.com` | `password123` |

---

## 🚂 Railway Deployment

### Step 1: Create Railway Account
Sign up at [railway.app](https://railway.app) and install the Railway CLI:
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Create a New Project
```bash
railway init
```

### Step 3: Add PostgreSQL
In the Railway dashboard, click **New Service → Database → PostgreSQL**. Railway will automatically set `DATABASE_URL`.

### Step 4: Set Environment Variables
In Railway dashboard → your service → **Variables**:
```
JWT_SECRET=your-production-secret-min-32-characters
NODE_ENV=production
FRONTEND_URL=https://your-app.up.railway.app
```

### Step 5: Configure Build & Deploy
The `railway.json` in the root configures Railway to:
1. Use Nixpacks builder
2. Run `npm run start` as the start command

The backend's `package.json` build script will:
1. Install all dependencies
2. Build the frontend (`npm run build --prefix ../frontend`)
3. Compile TypeScript
4. Run Prisma migrations
5. Start the Express server which serves the built frontend

### Step 6: Deploy
```bash
railway up
```

Or connect your GitHub repository in the Railway dashboard for automatic deploys on push.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | No | Register new user |
| `POST` | `/api/auth/login` | No | Login and get JWT |
| `GET` | `/api/auth/me` | Yes | Get current user |

### Projects

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/projects` | Yes | Any | List user's projects |
| `POST` | `/api/projects` | Yes | Admin | Create project |
| `GET` | `/api/projects/:id` | Yes | Member | Get project details |
| `PUT` | `/api/projects/:id` | Yes | Project Admin | Update project |
| `DELETE` | `/api/projects/:id` | Yes | Project Admin | Delete project |

### Members

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/projects/:id/members` | Yes | Project Admin | Add member |
| `GET` | `/api/projects/:id/members` | Yes | Member | List members |
| `DELETE` | `/api/projects/:id/members/:userId` | Yes | Project Admin | Remove member |

### Tasks

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/tasks` | Yes | Any | List tasks (filterable) |
| `POST` | `/api/tasks` | Yes | Project Admin | Create task |
| `GET` | `/api/tasks/:id` | Yes | Member | Get task details |
| `PUT` | `/api/tasks/:id` | Yes | Any | Update task |
| `DELETE` | `/api/tasks/:id` | Yes | Project Admin | Delete task |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/dashboard` | Yes | Get dashboard stats |

---

## 📁 Folder Structure

```
team-task-manager/
├── .gitignore
├── railway.json              # Railway deployment config
├── README.md
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Demo data seeding
│   └── src/
│       ├── index.ts          # Express app entry point
│       ├── config/           # DB + env config
│       ├── controllers/      # Route handlers
│       ├── middleware/       # Auth, RBAC, validation, errors
│       ├── routes/           # API route definitions
│       ├── services/         # Business logic
│       ├── validators/       # Zod schemas
│       └── utils/            # JWT, password, response helpers
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.tsx            # Router setup
        ├── main.tsx           # React entry point
        ├── index.css          # Global styles + Tailwind
        ├── api/               # Axios + API functions
        ├── components/
        │   ├── charts/        # StatsCard, PieChart
        │   ├── layout/        # Sidebar, Topbar, Layout
        │   ├── projects/      # ProjectCard, ProjectForm
        │   ├── tasks/         # TaskCard, TaskList, TaskForm
        │   └── ui/            # Button, Modal, Toast, Input...
        ├── contexts/          # AuthContext, ToastContext
        ├── hooks/             # useAuth, useToast
        ├── pages/             # All page components
        ├── types/             # TypeScript interfaces
        └── utils/             # Date formatters, helpers
```

---

## 🎬 Demo Instructions

Follow these steps to showcase TeamFlow in a 2–5 minute demo:

1. **Sign Up** — Create a new admin account at `/signup`
2. **Dashboard** — View the empty dashboard with zero stats
3. **Create Project** — Go to Projects, create "Website Redesign"
4. **Add Members** — Open the project, switch to Members tab, add the member user
5. **Create Tasks** — Create 3+ tasks with different priorities and due dates
6. **Assign Tasks** — Assign tasks to the member user
7. **Member Login** — Open incognito, log in as `member@demo.com`
8. **View Assignments** — Member sees their assigned tasks in dashboard
9. **Update Status** — Member updates a task from TODO → IN_PROGRESS → COMPLETED
10. **Admin Dashboard** — Back in admin, see updated stats and charts
11. **Responsive** — Resize window to show mobile layout

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens (7-day expiry)
- Helmet.js security headers
- CORS restricted to frontend origin
- Rate limiting on auth endpoints (15 req/15 min)
- Zod input validation on all endpoints
- SQL injection protection via Prisma parameterized queries
- Passwords never included in API responses

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ using React, Node.js, and PostgreSQL

</div>
