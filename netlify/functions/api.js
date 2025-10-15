const serverless = require('serverless-http');
const app = require('../../src/server');

// Wrap Express app for Netlify Functions
exports.handler = serverless(app);
