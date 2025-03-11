const express = require('express');
const { updateProfile, changePassword } = require('../controllers/users');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Update user profile
router.put('/profile', updateProfile);

// Change password
router.put('/password', changePassword);

module.exports = router; 