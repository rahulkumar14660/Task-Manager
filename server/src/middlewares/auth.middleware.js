const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User.model');
const { sendError } = require('../utils/responseHandler');

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user to request
 *
 * Expected header format: Authorization: Bearer <token>
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return sendError(res, 401, 'Access denied. No token provided. Please login.');
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Token has expired. Please login again.');
      }
      if (err.name === 'JsonWebTokenError') {
        return sendError(res, 401, 'Invalid token. Please login again.');
      }
      return sendError(res, 401, 'Token verification failed.');
    }

    // Find user by decoded ID and verify they still exist
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, 'User associated with this token no longer exists.');
    }

    // Attach user info to request object
    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return sendError(res, 500, 'Authentication error');
  }
};

module.exports = { authenticate };
