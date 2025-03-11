const express = require('express');
const { 
  getConversations, 
  getConversation, 
  createConversation, 
  sendMessage, 
  generateAiResponse 
} = require('../controllers/chats');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes for widget
router.post('/conversations', createConversation);
router.post('/conversations/:conversationId/messages', sendMessage);

// Protected routes
router.use(authenticate);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.post('/conversations/:conversationId/ai-response', generateAiResponse);

module.exports = router; 