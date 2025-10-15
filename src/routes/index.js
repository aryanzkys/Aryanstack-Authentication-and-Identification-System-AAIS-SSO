const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const { login, callback } = require('../controllers/oauthController');
const { getProfile } = require('../controllers/userController');
const { logout } = require('../controllers/logoutController');
const { verifyToken } = require('../middleware/auth');

/**
 * Authentication routes
 */

// POST /signup - Register a new user
router.post('/signup', signup);

// POST /login - Login and get OAuth2 authorization
router.post('/login', login);

// GET /callback - OAuth2 callback endpoint
router.get('/callback', callback);

// GET /profile - Get user profile (protected)
router.get('/profile', verifyToken, getProfile);

// GET /logout - Logout user (protected)
router.get('/logout', verifyToken, logout);

module.exports = router;
