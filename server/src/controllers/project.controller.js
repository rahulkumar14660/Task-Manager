const { validationResult } = require('express-validator');
const ProjectService = require('../services/project.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Project Controller
 * Handles HTTP requests for project management
 */

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }

    const project = await ProjectService.createProject(req.body, req.user.id);

    return sendSuccess(res, 201, 'Project created successfully', project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectService.getProjects(req.user.id, req.user.role);

    return sendSuccess(res, 200, 'Projects retrieved successfully', projects);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await ProjectService.getProjectById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return sendSuccess(res, 200, 'Project retrieved successfully', project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a member to a project
 * @route   POST /api/projects/:id/members
 * @access  Private (Admin)
 */
const addMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }

    const project = await ProjectService.addMember(
      req.params.id,
      req.body.email,
      req.user.id
    );

    return sendSuccess(res, 200, 'Member added successfully', project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove a member from a project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private (Admin)
 */
const removeMember = async (req, res, next) => {
  try {
    const project = await ProjectService.removeMember(
      req.params.id,
      req.params.userId,
      req.user.id
    );

    return sendSuccess(res, 200, 'Member removed successfully', project);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  removeMember,
};
