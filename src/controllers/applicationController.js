const { supabaseAdmin } = require('../config/supabase');
const { hydraAdmin } = require('../config/hydra');
const logger = require('../utils/logger');
const { generateSecureKey } = require('../utils/helpers');

/**
 * Get all applications
 */
const getAllApplications = async (req, res, next) => {
  try {
    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ applications: applications || [] });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new application
 */
const createApplication = async (req, res, next) => {
  try {
    const { name, description, redirectUris, scopes } = req.body;
    const userId = req.user.userId;

    if (!name || !redirectUris || redirectUris.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name and redirect URIs are required',
      });
    }

    // Generate client credentials
    const clientId = `app_${generateSecureKey(16)}`;
    const clientSecret = generateSecureKey(32);

    // Create application in database
    const { data: app, error } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          name,
          description,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uris: redirectUris,
          scopes: scopes || ['openid', 'profile', 'email'],
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Register OAuth2 client with Hydra
    try {
      await hydraAdmin.post('/clients', {
        client_id: clientId,
        client_name: name,
        client_secret: clientSecret,
        redirect_uris: redirectUris,
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code', 'id_token'],
        scope: (scopes || ['openid', 'profile', 'email']).join(' '),
        token_endpoint_auth_method: 'client_secret_basic',
      });

      logger.info(`Application created and registered with Hydra: ${name}`);
    } catch (hydraError) {
      logger.error('Failed to register with Hydra:', hydraError.message);
      // Continue anyway - app is in database
    }

    res.status(201).json({
      message: 'Application created successfully',
      application: app,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update application
 */
const updateApplication = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const { name, description, redirectUris, scopes, isActive } = req.body;

    const { data: app, error } = await supabaseAdmin
      .from('applications')
      .update({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(redirectUris && { redirect_uris: redirectUris }),
        ...(scopes && { scopes }),
        ...(isActive !== undefined && { is_active: isActive }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', appId)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Application updated: ${appId}`);

    res.json({
      message: 'Application updated successfully',
      application: app,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete application
 */
const deleteApplication = async (req, res, next) => {
  try {
    const { appId } = req.params;

    // Get app details for Hydra cleanup
    const { data: app } = await supabaseAdmin
      .from('applications')
      .select('client_id')
      .eq('id', appId)
      .single();

    // Delete from database
    const { error } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', appId);

    if (error) throw error;

    // Delete from Hydra if exists
    if (app?.client_id) {
      try {
        await hydraAdmin.delete(`/clients/${app.client_id}`);
      } catch (hydraError) {
        logger.warn('Failed to delete from Hydra:', hydraError.message);
      }
    }

    logger.info(`Application deleted: ${appId}`);

    res.json({
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};
