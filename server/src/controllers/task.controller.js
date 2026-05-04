const { validationResult } = require('express-validator');
const TaskService = require('../services/task.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Task Controller
 * Handles HTTP requests for task management
 */

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private (Admin)
 */
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }

    const task = await TaskService.createTask(req.body, req.user.id);

    return sendSuccess(res, 201, 'Task created successfully', task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks by project ID
 * @route   GET /api/tasks/project/:projectId
 * @access  Private
 */
const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await TaskService.getTasksByProject(
      req.params.projectId,
      req.user.id,
      req.user.role
    );

    return sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks assigned to current user
 * @route   GET /api/tasks/my
 * @access  Private
 */
const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await TaskService.getMyTasks(req.user.id);

    return sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }

    const task = await TaskService.updateTask(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );

    return sendSuccess(res, 200, 'Task updated successfully', task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Admin)
 */
const deleteTask = async (req, res, next) => {
  try {
    const result = await TaskService.deleteTask(req.params.id, req.user.id);

    return sendSuccess(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/tasks/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await TaskService.getDashboardStats(req.user.id, req.user.role);

    return sendSuccess(res, 200, 'Dashboard stats retrieved', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTask,
  deleteTask,
  getDashboardStats,
};
