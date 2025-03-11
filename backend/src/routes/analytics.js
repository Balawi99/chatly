const express = require('express');
const { getDashboardAnalytics, getWidgetAnalytics } = require('../controllers/analytics');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Analytics routes
router.get('/dashboard', getDashboardAnalytics);
router.get('/widgets/:widgetId', getWidgetAnalytics);

module.exports = router; 