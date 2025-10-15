const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const { login, callback } = require('../controllers/oauthController');
const { getProfile } = require('../controllers/userController');
const { logout } = require('../controllers/logoutController');
const { verifyToken } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

/**
 * Authentication routes
 */

// POST /signup - Register a new user (rate limited)
router.post('/signup', authLimiter, signup);

// POST /login - Login and get OAuth2 authorization (rate limited)
router.post('/login', authLimiter, login);

// GET /callback - OAuth2 callback endpoint
router.get('/callback', callback);

// GET /profile - Get user profile (protected, rate limited)
router.get('/profile', apiLimiter, verifyToken, getProfile);

// GET /logout - Logout user (protected, rate limited)
router.get('/logout', apiLimiter, verifyToken, logout);

module.exports = router;
