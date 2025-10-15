const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { ensureOAuth2Client } = require('./config/hydra');
const logger = require('./utils/logger');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.server.env === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.server.env
  });
});

// API routes
app.use('/api', routes);

// Backward compatibility routes (without /api prefix)
app.use('/', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Initialize OAuth2 client and start server
const startServer = async () => {
  try {
    // Ensure OAuth2 client is registered in Hydra
    await ensureOAuth2Client();

    // Start server
    const PORT = config.server.port;
    app.listen(PORT, () => {
      logger.info(`🚀 AAIS SSO Server running on port ${PORT}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`Hydra Admin URL: ${config.hydra.adminUrl}`);
      logger.info(`Hydra Public URL: ${config.hydra.publicUrl}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
