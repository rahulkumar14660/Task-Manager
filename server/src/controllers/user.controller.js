const User = require('../models/User.model');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * User Controller
 * Handles HTTP requests for user-related operations
 */

/**
 * @desc    Get all users (for admin to search/add members)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    // Optional search by name or email
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const users = await User.find(query)
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserProfile };
