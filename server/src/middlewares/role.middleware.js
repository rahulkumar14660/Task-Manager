const { sendError } = require('../utils/responseHandler');

/**
 * Role-Based Authorization Middleware
 * Restricts access to specific routes based on user role
 *
 * @param  {...string} allowedRoles - Roles that are permitted access
 * @returns {Function} Express middleware function
 *
 * Usage: authorize('admin') or authorize('admin', 'member')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return sendError(res, 401, 'Authentication required. Please login first.');
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`
      );
    }

    next();
  };
};

module.exports = { authorize };
