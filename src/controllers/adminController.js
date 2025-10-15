const { supabaseAdmin } = require('../config/supabase');
const { hydraAdmin } = require('../config/hydra');
const logger = require('../utils/logger');
const { generateSecureKey } = require('../utils/helpers');

/**
 * Get admin dashboard statistics
 */
const getAdminStats = async (req, res, next) => {
  try {
    // Get total users count
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get applications count
    const { count: totalApplications } = await supabaseAdmin
      .from('applications')
      .select('*', { count: 'exact', head: true });

    // Get API keys count
    const { count: totalApiKeys } = await supabaseAdmin
      .from('api_keys')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    res.json({
      totalUsers: totalUsers || 0,
      totalApplications: totalApplications || 0,
      totalApiKeys: totalApiKeys || 0,
      activeUsers: 0,
      recentLogins: 0,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { data: users, error, count } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) throw error;

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'developer', 'user', 'viewer'].includes(role)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid role',
      });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    logger.info(`User role updated: ${userId} -> ${role}`);

    res.json({
      message: 'User role updated successfully',
      user: {
        id: data.id,
        email: data.email,
        role: data.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate user
 */
const deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { error } = await supabaseAdmin
      .from('users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;

    logger.info(`User deactivated: ${userId}`);

    res.json({
      message: 'User deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    logger.info(`User deleted: ${userId}`);

    res.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  deleteUser,
};
