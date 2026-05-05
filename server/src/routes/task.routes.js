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
const { checkProjectAccess } = require('../middlewares/project.middleware');
const { checkTaskAccess } = require('../middlewares/task.middleware');

const { ROLES } = require('../constants/roles');
const { validateCreateTask, validateUpdateTask } = require('../utils/validators');

/**
 * @route   /api/tasks
 */

// 🔐 Dashboard
router.get('/dashboard', authenticate, getDashboardStats);

// 🔐 My Tasks
router.get('/my', authenticate, getMyTasks);

// 🔐 Create Task (Admin only)
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validateCreateTask,
  createTask
);

// 🔐 Get tasks by project (Admin OR project members)
router.get(
  '/project/:projectId',
  authenticate,
  checkProjectAccess,
  getTasksByProject
);

// 🔐 Update task (Admin OR assigned user)
router.put(
  '/:id',
  authenticate,
  checkTaskAccess,
  validateUpdateTask,
  updateTask
);

// 🔐 Delete task (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  deleteTask
);

module.exports = router;