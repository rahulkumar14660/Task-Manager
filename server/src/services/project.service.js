const Project = require('../models/Project.model');
const User = require('../models/User.model');
const Task = require('../models/Task.model');
const { ROLES } = require('../constants/roles');

/**
 * Project Service
 * Handles all business logic related to project management
 */
class ProjectService {
  /**
   * Create a new project
   * @param {Object} data - Project data
   * @param {string} data.title - Project title
   * @param {string} [data.description] - Project description
   * @param {string} userId - ID of the admin creating the project
   * @returns {Object} Created project
   */
  static async createProject(data, userId) {
    const project = await Project.create({
      title: data.title,
      description: data.description || '',
      createdBy: userId,
      members: [userId], // Creator is always a member
    });

    // Populate creator info
    await project.populate('createdBy', 'name email role');
    await project.populate('members', 'name email role');

    return project;
  }

  /**
   * Get all projects accessible to the user
   * Admins see projects they created, members see projects they belong to
   * @param {string} userId - Current user's ID
   * @param {string} role - Current user's role
   * @returns {Array} List of projects
   */
  static async getProjects(userId, role) {
    let query;

    if (role === ROLES.ADMIN) {
      // Admin sees projects they created
      query = { createdBy: userId };
    } else {
      // Members see projects they are part of
      query = { members: userId };
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .sort({ createdAt: -1 });

    // Get task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        const projectObj = project.toObject();
        projectObj.taskCount = taskCount;
        return projectObj;
      })
    );

    return projectsWithCounts;
  }

  /**
   * Get a single project by ID with authorization check
   * @param {string} projectId - Project's MongoDB ObjectId
   * @param {string} userId - Current user's ID
   * @param {string} role - Current user's role
   * @returns {Object} Project details
   */
  static async getProjectById(projectId, userId, role) {
    const project = await Project.findById(projectId)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role');

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Check authorization: admin must be creator, member must be in members
    const isCreator = project.createdBy._id.toString() === userId;
    const isMember = project.members.some((m) => m._id.toString() === userId);

    if (!isCreator && !isMember) {
      const error = new Error('You do not have access to this project');
      error.statusCode = 403;
      throw error;
    }

    // Get task count
    const taskCount = await Task.countDocuments({ project: project._id });
    const projectObj = project.toObject();
    projectObj.taskCount = taskCount;

    return projectObj;
  }

  /**
   * Add a member to a project by their email
   * @param {string} projectId - Project's MongoDB ObjectId
   * @param {string} memberEmail - Email of the user to add
   * @param {string} adminId - ID of the admin performing the action
   * @returns {Object} Updated project
   */
  static async addMember(projectId, memberEmail, adminId) {
    const project = await Project.findById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify the requesting user is the project creator
    if (project.createdBy.toString() !== adminId) {
      const error = new Error('Only the project creator can add members');
      error.statusCode = 403;
      throw error;
    }

    // Find the user to add by email
    const userToAdd = await User.findOne({ email: memberEmail });

    if (!userToAdd) {
      const error = new Error('No user found with this email address');
      error.statusCode = 404;
      throw error;
    }

    // Check if user is already a member
    const isAlreadyMember = project.members.some(
      (m) => m.toString() === userToAdd._id.toString()
    );

    if (isAlreadyMember) {
      const error = new Error('User is already a member of this project');
      error.statusCode = 400;
      throw error;
    }

    // Add user to members array
    project.members.push(userToAdd._id);
    await project.save();

    // Return populated project
    await project.populate('createdBy', 'name email role');
    await project.populate('members', 'name email role');

    return project;
  }

  /**
   * Remove a member from a project
   * @param {string} projectId - Project's MongoDB ObjectId
   * @param {string} memberId - ID of the member to remove
   * @param {string} adminId - ID of the admin performing the action
   * @returns {Object} Updated project
   */
  static async removeMember(projectId, memberId, adminId) {
    const project = await Project.findById(projectId);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify the requesting user is the project creator
    if (project.createdBy.toString() !== adminId) {
      const error = new Error('Only the project creator can remove members');
      error.statusCode = 403;
      throw error;
    }

    // Cannot remove the project creator
    if (memberId === adminId) {
      const error = new Error('Cannot remove the project creator from the project');
      error.statusCode = 400;
      throw error;
    }

    // Check if user is a member
    const memberIndex = project.members.findIndex(
      (m) => m.toString() === memberId
    );

    if (memberIndex === -1) {
      const error = new Error('User is not a member of this project');
      error.statusCode = 400;
      throw error;
    }

    // Remove member
    project.members.splice(memberIndex, 1);
    await project.save();

    // Also unassign any tasks assigned to this member in this project
    await Task.updateMany(
      { project: projectId, assignedTo: memberId },
      { assignedTo: adminId } // Reassign to admin
    );

    // Return populated project
    await project.populate('createdBy', 'name email role');
    await project.populate('members', 'name email role');

    return project;
  }
}

module.exports = ProjectService;
