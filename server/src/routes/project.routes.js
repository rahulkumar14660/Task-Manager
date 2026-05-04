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
const { ROLES } = require('../constants/roles');
const { validateCreateProject, validateAddMember } = require('../utils/validators');

/**
 * @route   /api/projects
 * Project routes for CRUD and member management
 */

// POST /api/projects — Create a new project (Admin only)
router.post('/', authenticate, authorize(ROLES.ADMIN), validateCreateProject, createProject);

// GET /api/projects — Get all projects for current user
router.get('/', authenticate, getProjects);

// GET /api/projects/:id — Get a single project by ID
router.get('/:id', authenticate, getProjectById);

// POST /api/projects/:id/members — Add a member to project (Admin only)
router.post('/:id/members', authenticate, authorize(ROLES.ADMIN), validateAddMember, addMember);

// DELETE /api/projects/:id/members/:userId — Remove a member (Admin only)
router.delete('/:id/members/:userId', authenticate, authorize(ROLES.ADMIN), removeMember);

module.exports = router;
