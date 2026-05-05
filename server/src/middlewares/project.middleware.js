const Project = require('../models/project.model');
const { sendError } = require('../utils/responseHandler');

/**
 * Project Access Middleware
 * Allows access only to Admin or project members
 *
 * Works for routes with:
 * - :id (projectId)
 * - :projectId
 */
const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;

    if (!projectId) {
      return sendError(res, 400, 'Project ID is required');
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return sendError(res, 404, 'Project not found');
    }

    // Admin always allowed
    if (req.user.role === 'admin') {
      req.project = project;
      return next();
    }

    // Check membership
    const isMember = project.members?.some(
      (m) => m.toString() === req.user.id
    );

    if (!isMember) {
      return sendError(res, 403, 'Access denied to this project');
    }

    req.project = project;
    next();
  } catch (err) {
    console.error('Project middleware error:', err);
    return sendError(res, 500, 'Server error while checking project access');
  }
};

module.exports = { checkProjectAccess };