const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateSignup, validateLogin } = require('../utils/validators');

/**
 * @route   /api/auth
 * Authentication routes for signup, login, and profile
 */

// POST /api/auth/signup — Register a new user
router.post('/signup', validateSignup, signup);

// POST /api/auth/login — Login user
router.post('/login', validateLogin, login);

// GET /api/auth/me — Get current logged-in user (Protected)
router.get('/me', authenticate, getMe);

module.exports = router;
