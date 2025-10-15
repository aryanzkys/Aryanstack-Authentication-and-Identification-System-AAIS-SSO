require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  hydra: {
    adminUrl: process.env.HYDRA_ADMIN_URL || 'http://localhost:4445',
    publicUrl: process.env.HYDRA_PUBLIC_URL || 'http://localhost:4444',
    clientId: process.env.HYDRA_CLIENT_ID,
    clientSecret: process.env.HYDRA_CLIENT_SECRET,
    redirectUri: process.env.HYDRA_REDIRECT_URI || 'http://localhost:3000/callback',
    logoutRedirectUri: process.env.HYDRA_LOGOUT_REDIRECT_URI || 'http://localhost:3000/'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  session: {
    secret: process.env.SESSION_SECRET
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000']
  }
};
