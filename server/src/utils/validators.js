const { body, param } = require('express-validator');
const { TASK_STATUS_VALUES, ROLE_VALUES } = require('../constants/roles');

/**
 * Validation chains for API endpoints
 * Uses express-validator for declarative input validation
 */

// ─── Auth Validators ────────────────────────────────────────────────

const validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(ROLE_VALUES)
    .withMessage('Role must be either admin or member'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// ─── Project Validators ─────────────────────────────────────────────

const validateCreateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

const validateAddMember = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Member email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
];

// ─── Task Validators ────────────────────────────────────────────────

const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('project')
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid project ID'),

  body('assignedTo')
    .notEmpty()
    .withMessage('Assigned user ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),

  body('status')
    .optional()
    .isIn(TASK_STATUS_VALUES)
    .withMessage('Status must be todo, in-progress, or done'),
];

const validateUpdateTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Title must be between 2 and 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('status')
    .optional()
    .isIn(TASK_STATUS_VALUES)
    .withMessage('Status must be todo, in-progress, or done'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),

  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
];

module.exports = {
  validateSignup,
  validateLogin,
  validateCreateProject,
  validateAddMember,
  validateCreateTask,
  validateUpdateTask,
};
