const express = require('express');
const router = express.Router();
const { getAllUsers, getUserProfile } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../constants/roles');

/**
 * @route   /api/users
 * User routes for listing users and profile management
 */

// GET /api/users — Get all users (Admin only, for adding members)
router.get('/', authenticate, authorize(ROLES.ADMIN), getAllUsers);

// GET /api/users/profile — Get current user profile
router.get('/profile', authenticate, getUserProfile);

module.exports = router;
