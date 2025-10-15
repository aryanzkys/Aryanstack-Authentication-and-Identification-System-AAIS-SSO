const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Admin controllers
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  deleteUser,
} = require('../controllers/adminController');

const {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

/**
 * Admin middleware - checks if user has admin privileges
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'developer') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin privileges required',
    });
  }
  next();
};

// Dashboard stats
router.get('/stats', apiLimiter, verifyToken, requireAdmin, getAdminStats);

// User management routes
router.get('/users', apiLimiter, verifyToken, requireAdmin, getAllUsers);
router.put('/users/:userId/role', apiLimiter, verifyToken, requireAdmin, updateUserRole);
router.put('/users/:userId/deactivate', apiLimiter, verifyToken, requireAdmin, deactivateUser);
router.delete('/users/:userId', apiLimiter, verifyToken, requireAdmin, deleteUser);

// Application management routes
router.get('/applications', apiLimiter, verifyToken, requireAdmin, getAllApplications);
router.post('/applications', apiLimiter, verifyToken, requireAdmin, createApplication);
router.put('/applications/:appId', apiLimiter, verifyToken, requireAdmin, updateApplication);
router.delete('/applications/:appId', apiLimiter, verifyToken, requireAdmin, deleteApplication);

module.exports = router;
