const bcrypt = require('bcrypt');
const { supabaseAdmin } = require('../config/supabase');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Sign up a new user
 */
const signup = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role = 'user' } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      logger.error('Supabase error during signup:', error);
      
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({
          error: 'Conflict',
          message: 'User with this email already exists'
        });
      }
      
      throw error;
    }

    logger.info(`User registered successfully: ${email}`);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email
    });

    // Store refresh token in database
    await supabaseAdmin
      .from('refresh_tokens')
      .insert([
        {
          user_id: user.id,
          token: refreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

    // Return user data and tokens
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup
};
