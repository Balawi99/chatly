// Import the Express app and server from src/index.js
const { app, server } = require('./src/index');

// For Vercel, we need to export the Express app
module.exports = app; 