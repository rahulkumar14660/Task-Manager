const User = require('../models/User.model');
const { generateToken } = require('../utils/generateToken');

/**
 * Authentication Service
 * Handles business logic for user registration and login
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password (plain text)
   * @param {string} [userData.role] - User's role (admin/member)
   * @returns {Object} Created user and JWT token
   */
  static async signup({ name, email, password, role }) {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'member',
    });

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Authenticate a user with email and password
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Object} Authenticated user and JWT token
   */
  static async login({ email, password }) {
    // Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Compare provided password with hashed password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get current user profile by ID
   * @param {string} userId - User's MongoDB ObjectId
   * @returns {Object} User profile data
   */
  static async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

module.exports = AuthService;
