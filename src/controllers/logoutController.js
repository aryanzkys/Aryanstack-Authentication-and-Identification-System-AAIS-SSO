const axios = require('axios');
const { supabaseAdmin } = require('../config/supabase');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Logout user
 * Revoke tokens and destroy session
 */
const logout = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const token = req.headers.authorization?.substring(7); // Remove 'Bearer '

    // Delete refresh tokens from database
    await supabaseAdmin
      .from('refresh_tokens')
      .delete()
      .eq('user_id', userId);

    // Attempt to revoke token from Hydra (if using Hydra tokens)
    try {
      await axios.post(
        `${config.hydra.adminUrl}/oauth2/revoke`,
        `token=${token}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          auth: {
            username: config.hydra.clientId,
            password: config.hydra.clientSecret
          }
        }
      );
      logger.info('Token revoked from Hydra');
    } catch (error) {
      // Log but don't fail logout if Hydra revocation fails
      logger.warn('Failed to revoke token from Hydra:', error.message);
    }

    logger.info(`User logged out: ${userId}`);

    res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logout
};
