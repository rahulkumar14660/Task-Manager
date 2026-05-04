const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

/**
 * Generate a JWT token for authenticated users
 * @param {Object} payload - Data to encode in the token
 * @param {string} payload.id - User's MongoDB ObjectId
 * @param {string} payload.role - User's role (admin/member)
 * @returns {string} Signed JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE,
    }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
