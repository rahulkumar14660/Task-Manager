const Task = require('../models/Task.model');
const Project = require('../models/Project.model');
const { ROLES, TASK_STATUS } = require('../constants/roles');

/**
 * Task Service
 * Handles all business logic related to task management
 */
class TaskService {
  /**
   * Create a new task within a project
   * @param {Object} data - Task data
   * @param {string} userId - ID of the admin creating the task
   * @returns {Object} Created task
   */
  static async createTask(data, userId) {
    // Verify project exists
    const project = await Project.findById(data.project);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify creator is the project admin
    if (project.createdBy.toString() !== userId) {
      const error = new Error('Only the project admin can create tasks');
      error.statusCode = 403;
      throw error;
    }

    // Verify assignee is a member of the project
    const isProjectMember = project.members.some(
      (m) => m.toString() === data.assignedTo
    );

    if (!isProjectMember) {
      const error = new Error('Assigned user must be a member of the project');
      error.statusCode = 400;
      throw error;
    }

    // Create the task
    const task = await Task.create({
      title: data.title,
      description: data.description || '',
      project: data.project,
      assignedTo: data.assignedTo,
      status: data.status || TASK_STATUS.TODO,
      dueDate: data.dueDate || null,
      createdBy: userId,
    });

    // Populate references
    await task.populate('assignedTo', 'name email role');
    await task.populate('project', 'title');
    await task.populate('createdBy', 'name email');

    return task;
  }

  /**
   * Get all tasks for a specific project
   * @param {string} projectId - Project's MongoDB ObjectId
   * @param {string} userId - Current user's ID
   * @param {string} role - Current user's role
   * @returns {Array} List of tasks
   */
  static async getTasksByProject(projectId, userId, role) {
    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    const isMember = project.members.some((m) => m.toString() === userId);
    const isCreator = project.createdBy.toString() === userId;

    if (!isMember && !isCreator) {
      const error = new Error('You do not have access to this project');
      error.statusCode = 403;
      throw error;
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email role')
      .populate('project', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return tasks;
  }

  /**
   * Get all tasks assigned to the current user
   * @param {string} userId - Current user's ID
   * @returns {Array} List of tasks assigned to user
   */
  static async getMyTasks(userId) {
    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name email role')
      .populate('project', 'title')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });

    return tasks;
  }

  /**
   * Update a task
   * Members can only update status of their own tasks
   * Admins can update any field of tasks in their projects
   * @param {string} taskId - Task's MongoDB ObjectId
   * @param {Object} updates - Fields to update
   * @param {string} userId - Current user's ID
   * @param {string} role - Current user's role
   * @returns {Object} Updated task
   */
  static async updateTask(taskId, updates, userId, role) {
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    // Get the project to check ownership
    const project = await Project.findById(task.project);

    if (!project) {
      const error = new Error('Associated project not found');
      error.statusCode = 404;
      throw error;
    }

    const isProjectAdmin = project.createdBy.toString() === userId;
    const isAssignee = task.assignedTo.toString() === userId;

    if (role === ROLES.MEMBER) {
      // Members can only update status of tasks assigned to them
      if (!isAssignee) {
        const error = new Error('You can only update tasks assigned to you');
        error.statusCode = 403;
        throw error;
      }

      // Members can only update the status field
      const allowedUpdates = { status: updates.status };
      if (!updates.status) {
        const error = new Error('Members can only update task status');
        error.statusCode = 400;
        throw error;
      }

      Object.assign(task, allowedUpdates);
    } else if (role === ROLES.ADMIN) {
      // Admins can update any field, but must be project creator
      if (!isProjectAdmin) {
        const error = new Error('Only the project admin can fully update tasks');
        error.statusCode = 403;
        throw error;
      }

      // If reassigning, verify new assignee is a project member
      if (updates.assignedTo) {
        const isNewAssigneeMember = project.members.some(
          (m) => m.toString() === updates.assignedTo
        );
        if (!isNewAssigneeMember) {
          const error = new Error('New assignee must be a member of the project');
          error.statusCode = 400;
          throw error;
        }
      }

      // Apply allowed updates
      const allowedFields = ['title', 'description', 'status', 'dueDate', 'assignedTo'];
      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          task[field] = updates[field];
        }
      });
    }

    await task.save();

    // Populate and return
    await task.populate('assignedTo', 'name email role');
    await task.populate('project', 'title');
    await task.populate('createdBy', 'name email');

    return task;
  }

  /**
   * Delete a task (Admin only)
   * @param {string} taskId - Task's MongoDB ObjectId
   * @param {string} userId - Current user's ID (must be project admin)
   * @returns {Object} Deleted task info
   */
  static async deleteTask(taskId, userId) {
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify user is the project admin
    const project = await Project.findById(task.project);

    if (!project || project.createdBy.toString() !== userId) {
      const error = new Error('Only the project admin can delete tasks');
      error.statusCode = 403;
      throw error;
    }

    await Task.findByIdAndDelete(taskId);

    return { message: 'Task deleted successfully', taskId };
  }

  /**
   * Get dashboard statistics for the current user
   * @param {string} userId - Current user's ID
   * @param {string} role - Current user's role
   * @returns {Object} Dashboard stats
   */
  static async getDashboardStats(userId, role) {
    let taskFilter;

    if (role === ROLES.ADMIN) {
      // Admin sees stats for all tasks in their projects
      const adminProjects = await Project.find({ createdBy: userId }).select('_id');
      const projectIds = adminProjects.map((p) => p._id);
      taskFilter = { project: { $in: projectIds } };
    } else {
      // Member sees stats for tasks assigned to them
      taskFilter = { assignedTo: userId };
    }

    // Get counts by status
    const [totalTasks, todoCount, inProgressCount, doneCount, overdueTasks, recentTasks] =
      await Promise.all([
        Task.countDocuments(taskFilter),
        Task.countDocuments({ ...taskFilter, status: TASK_STATUS.TODO }),
        Task.countDocuments({ ...taskFilter, status: TASK_STATUS.IN_PROGRESS }),
        Task.countDocuments({ ...taskFilter, status: TASK_STATUS.DONE }),
        Task.countDocuments({
          ...taskFilter,
          dueDate: { $lt: new Date() },
          status: { $ne: TASK_STATUS.DONE },
        }),
        Task.find(taskFilter)
          .populate('assignedTo', 'name email')
          .populate('project', 'title')
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    // Get project count
    let projectCount;
    if (role === ROLES.ADMIN) {
      projectCount = await Project.countDocuments({ createdBy: userId });
    } else {
      projectCount = await Project.countDocuments({ members: userId });
    }

    return {
      totalTasks,
      todoCount,
      inProgressCount,
      doneCount,
      overdueCount: overdueTasks,
      projectCount,
      recentTasks,
    };
  }
}

module.exports = TaskService;
