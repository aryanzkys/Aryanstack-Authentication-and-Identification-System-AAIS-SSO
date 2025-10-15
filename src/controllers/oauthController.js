const bcrypt = require('bcrypt');
const querystring = require('querystring');
const axios = require('axios');
const { supabaseAdmin } = require('../config/supabase');
const { hydraPublic } = require('../config/hydra');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Initiate OAuth2 login flow
 * Redirects to Ory Hydra authorization endpoint
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    // Verify user credentials in Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    // Generate OAuth2 authorization URL
    const authParams = {
      client_id: config.hydra.clientId,
      response_type: 'code',
      scope: 'openid profile email offline_access',
      redirect_uri: config.hydra.redirectUri,
      state: Buffer.from(JSON.stringify({ userId: user.id })).toString('base64')
    };

    const authUrl = `${config.hydra.publicUrl}/oauth2/auth?${querystring.stringify(authParams)}`;

    // For API-based login, we'll generate tokens directly instead of redirecting
    // In a browser-based flow, you would redirect to authUrl
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email
    });

    // Store refresh token
    await supabaseAdmin
      .from('refresh_tokens')
      .insert([
        {
          user_id: user.id,
          token: refreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

    logger.info(`User logged in successfully: ${email}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      accessToken,
      refreshToken,
      authUrl // Include auth URL for browser-based flows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle OAuth2 callback
 * Exchange authorization code for tokens
 */
const callback = async (req, res, next) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Authorization code is required'
      });
    }

    // Decode state to get user ID
    let userId;
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        userId = decodedState.userId;
      } catch (err) {
        logger.warn('Failed to decode state:', err);
      }
    }

    // Exchange authorization code for tokens with Hydra
    try {
      const tokenResponse = await axios.post(
        `${config.hydra.publicUrl}/oauth2/token`,
        querystring.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.hydra.redirectUri,
          client_id: config.hydra.clientId,
          client_secret: config.hydra.clientSecret
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, id_token, refresh_token, expires_in } = tokenResponse.data;

      logger.info('OAuth2 tokens received successfully');

      // If we have a user ID, fetch user data
      let user = null;
      if (userId) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        user = data;
      }

      res.json({
        message: 'Authentication successful',
        accessToken: access_token,
        idToken: id_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        user: user ? {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        } : null
      });
    } catch (error) {
      logger.error('Failed to exchange code for tokens:', error.response?.data || error.message);
      
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Failed to authenticate with OAuth2 provider'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  callback
};
