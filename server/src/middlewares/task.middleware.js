const Task = require('../models/Task.model');
const { sendError } = require('../utils/responseHandler');

/**
 * Task Access Middleware
 * Allows access only to Admin or assigned user
 */
const checkTaskAccess = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    // ✅ Admin always allowed
    if (req.user.role === 'admin') {
      req.task = task;
      return next();
    }

    // ✅ Assigned user allowed
    if (task.assignedTo?.toString() === req.user.id) {
      req.task = task;
      return next();
    }

    return sendError(res, 403, 'Not authorized for this task');
  } catch (err) {
    console.error('Task middleware error:', err);
    return sendError(res, 500, 'Server error while checking task access');
  }
};

module.exports = { checkTaskAccess };