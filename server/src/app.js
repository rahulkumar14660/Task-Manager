const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');

// Import error handlers
const {
  errorHandler,
  notFoundHandler,
} = require('./middlewares/error.middleware');

/**
 * Express Application Setup
 */
const app = express();

// ─── Global Middleware ────────────────────────────────────────────────

// CORS (Production-safe)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        env.CLIENT_URL, // from Railway env
        "http://localhost:5173",
        "https://task-manager-xi-seven-11.vercel.app",
        "https://task-manager-axsjcbh7f-rahuls-projects-07270dee.vercel.app"
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// ─── Health Check ─────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Team Task Manager API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────

app.use('/api/auth/login', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// ─── Error Handling ───────────────────────────────────────────────────

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;