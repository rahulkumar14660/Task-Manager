const express = require('express');
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  removeMember,
} = require('../controllers/project.controller');

const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { checkProjectAccess } = require('../middlewares/project.middleware');

const { ROLES } = require('../constants/roles');
const { validateCreateProject, validateAddMember } = require('../utils/validators');

/**
 * @route   /api/projects
 */

// Create Project (Admin only)
router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validateCreateProject,
  createProject
);

// Get projects for current user
router.get('/', authenticate, getProjects);

// Get single project (Admin OR member)
router.get(
  '/:id',
  authenticate,
  checkProjectAccess,
  getProjectById
);

// Add member (Admin only + project access check)
router.post(
  '/:id/members',
  authenticate,
  authorize(ROLES.ADMIN),
  checkProjectAccess,
  validateAddMember,
  addMember
);

// Remove member (Admin only + project access check)
router.delete(
  '/:id/members/:userId',
  authenticate,
  authorize(ROLES.ADMIN),
  checkProjectAccess,
  removeMember
);

module.exports = router;