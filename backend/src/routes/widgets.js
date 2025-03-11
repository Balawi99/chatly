const express = require('express');
const { 
  getWidgets, 
  getWidget, 
  createWidget, 
  updateWidget, 
  deleteWidget,
  getPublicWidget
} = require('../controllers/widgets');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/public/:id', getPublicWidget);

// Protected routes
router.use(authenticate);
router.get('/', getWidgets);
router.get('/:id', getWidget);
router.post('/', createWidget);
router.put('/:id', updateWidget);
router.delete('/:id', deleteWidget);

module.exports = router; 