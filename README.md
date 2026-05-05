# 🚀 Team Task Manager

A full-stack **Team Task Management System** built using the **MERN stack**, featuring role-based access control, project collaboration, and real-time task tracking.

---

## ✨ Features

* 🔐 **Authentication** — Secure Signup/Login using JWT
* 🛡️ **Role-Based Access Control** — Admin & Member permissions
* 📁 **Project Management** — Create projects, manage team members
* ✅ **Task Management** — Assign, update, and track tasks
* 📊 **Dashboard & Analytics** — Task insights and status tracking
* 📱 **Responsive UI** — Works across all devices

---

## 👥 Roles & Permissions

| Action                | Admin | Member |
| --------------------- | :---: | :----: |
| Create Project        |   ✅   |    ❌   |
| Add/Remove Members    |   ✅   |    ❌   |
| Create & Assign Tasks |   ✅   |    ❌   |
| View Assigned Tasks   |   ✅   |    ✅   |
| Update Task Status    |   ✅   |    ✅   |
| Delete Tasks          |   ✅   |    ❌   |

---

## 🛠️ Tech Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React, Vite, Tailwind CSS |
| Backend  | Node.js, Express.js       |
| Database | MongoDB (Mongoose)        |
| Auth     | JWT, bcrypt               |

---

## 📂 Project Structure

```
team-task-manager/
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── ...
├── server/
│   ├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   └── ...
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd team-task-manager
```

---

### 2️⃣ Install Dependencies

```bash
npm run install:all
```

---

### 3️⃣ Setup Environment Variables

#### 📁 server/.env

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

#### 📁 client/.env

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4️⃣ Run Application

```bash
npm run dev
```

---

## 🌐 Running URLs

* 🔹 Frontend → http://localhost:5173
* 🔹 Backend → http://localhost:5000/api

---

## 📡 API Endpoints

### 🔐 Authentication

* `POST /api/auth/signup`
* `POST /api/auth/login`
* `GET /api/auth/me`

---

### 📁 Projects

* `POST /api/projects`
* `GET /api/projects`
* `GET /api/projects/:id`
* `POST /api/projects/:id/members`
* `DELETE /api/projects/:id/members/:userId`

---

### ✅ Tasks

* `POST /api/tasks`
* `GET /api/tasks/project/:projectId`
* `GET /api/tasks/my`
* `PUT /api/tasks/:id`
* `DELETE /api/tasks/:id`
* `GET /api/tasks/dashboard`

---

## 🔐 Security Features

* JWT Authentication
* Role-based route protection
* Project-level access control
* Task ownership validation

---

## 🚀 Future Improvements

* Notifications system
* Real-time updates (WebSockets)
* File attachments
* Activity logs

---

## 📄 License

Licensed under ISC.
