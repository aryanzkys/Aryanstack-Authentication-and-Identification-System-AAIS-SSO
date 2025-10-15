const axios = require('axios');
const config = require('./index');

// Create Hydra Admin API client
const hydraAdmin = axios.create({
  baseURL: config.hydra.adminUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create Hydra Public API client
const hydraPublic = axios.create({
  baseURL: config.hydra.publicUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get OAuth2 client configuration
 */
const getOAuth2Client = () => ({
  client_id: config.hydra.clientId,
  client_secret: config.hydra.clientSecret,
  redirect_uris: [config.hydra.redirectUri],
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code', 'id_token'],
  scope: 'openid profile email offline_access',
  token_endpoint_auth_method: 'client_secret_basic'
});

/**
 * Create or update OAuth2 client in Hydra
 */
async function ensureOAuth2Client() {
  try {
    const clientConfig = getOAuth2Client();
    
    // Try to get existing client
    try {
      await hydraAdmin.get(`/clients/${config.hydra.clientId}`);
      console.log('OAuth2 client already exists');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Client doesn't exist, create it
        await hydraAdmin.post('/clients', clientConfig);
        console.log('OAuth2 client created successfully');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error ensuring OAuth2 client:', error.message);
    // Don't throw - allow app to start even if Hydra is not available
  }
}

module.exports = {
  hydraAdmin,
  hydraPublic,
  ensureOAuth2Client,
  getOAuth2Client
};
