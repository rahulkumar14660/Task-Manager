const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/task.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../constants/roles');
const { validateCreateTask, validateUpdateTask } = require('../utils/validators');

/**
 * @route   /api/tasks
 * Task routes for CRUD, assignment, and dashboard
 */

// GET /api/tasks/dashboard — Get dashboard statistics (must be before /:id)
router.get('/dashboard', authenticate, getDashboardStats);

// GET /api/tasks/my — Get tasks assigned to current user
router.get('/my', authenticate, getMyTasks);

// POST /api/tasks — Create a new task (Admin only)
router.post('/', authenticate, authorize(ROLES.ADMIN), validateCreateTask, createTask);

// GET /api/tasks/project/:projectId — Get tasks by project
router.get('/project/:projectId', authenticate, getTasksByProject);

// PUT /api/tasks/:id — Update a task
router.put('/:id', authenticate, validateUpdateTask, updateTask);

// DELETE /api/tasks/:id — Delete a task (Admin only)
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), deleteTask);

module.exports = router;
