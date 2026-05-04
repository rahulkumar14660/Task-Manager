# 🚀 Team Task Manager

A full-stack web application for team task management with role-based access control. Built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

## ✨ Features

- **Authentication** — Signup/Login with JWT-based authentication
- **Role-Based Access Control** — Admin and Member roles with granular permissions
- **Project Management** — Create projects, add/remove team members
- **Task Management** — Create, assign, and track tasks with status updates
- **Dashboard** — Overview of tasks, statuses, and overdue items
- **Responsive Design** — Works seamlessly on desktop and mobile

## 🔐 Roles & Permissions

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create Project | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| Create & Assign Tasks | ✅ | ❌ |
| View Assigned Tasks | ✅ | ✅ |
| Update Task Status | ✅ | ✅ |
| Delete Tasks | ✅ | ❌ |

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT, bcryptjs |

## 📁 Project Structure

```
team-task-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # API service functions
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   └── utils/          # Helper utilities
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── constants/      # App constants & enums
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/     # Auth, role, error middlewares
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   └── utils/          # Helper functions
│   └── ...
└── package.json            # Root monorepo config
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-task-manager
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/team-task-manager
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   - Backend runs on: `http://localhost:5000`
   - Frontend runs on: `http://localhost:5173`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create a project (Admin) |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects/:id/members` | Add member (Admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (Admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a task (Admin) |
| GET | `/api/tasks/project/:projectId` | Get tasks by project |
| GET | `/api/tasks/my` | Get my assigned tasks |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task (Admin) |
| GET | `/api/tasks/dashboard` | Get dashboard statistics |

## 📄 License

This project is licensed under the ISC License.
