const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

/**
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Fetch user from Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile
};
