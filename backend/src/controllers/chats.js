const prisma = require('../config/prisma');
const openaiService = require('../services/openai');

/**
 * Get all conversations for the current user
 */
const getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.id },
      include: {
        widget: {
          select: {
            name: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a single conversation by ID with messages
 */
const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        widget: {
          select: {
            name: true,
            color: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.'
      });
    }
    
    // Check if conversation belongs to user
    if (conversation.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this conversation.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { conversation }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new conversation (usually from widget)
 */
const createConversation = async (req, res) => {
  try {
    const { widgetId, visitorId } = req.body;
    
    // Check if widget exists
    const widget = await prisma.widget.findUnique({
      where: { id: widgetId }
    });
    
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found.'
      });
    }
    
    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        widgetId,
        visitorId,
        userId: widget.userId
      }
    });
    
    // Create welcome message
    await prisma.message.create({
      data: {
        content: widget.welcomeMessage,
        isFromVisitor: false,
        isAiGenerated: true,
        conversationId: conversation.id,
        userId: widget.userId
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Conversation created successfully.',
      data: { conversation }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send a message in a conversation
 */
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, isFromVisitor } = req.body;
    
    // Check if conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.'
      });
    }
    
    // If message is from admin, check if conversation belongs to user
    if (!isFromVisitor && conversation.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to send messages in this conversation.'
      });
    }
    
    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        isFromVisitor,
        conversationId,
        userId: isFromVisitor ? null : req.user.id
      }
    });
    
    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate AI response to a message
 */
const generateAiResponse = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Check if conversation exists and belongs to user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 10 // Get last 10 messages for context
        }
      }
    });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.'
      });
    }
    
    if (conversation.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this conversation.'
      });
    }
    
    // Generate AI response using OpenAI service
    const aiResponse = await openaiService.generateResponse(conversationId);
    
    // Create AI message
    const message = await prisma.message.create({
      data: {
        content: aiResponse,
        isFromVisitor: false,
        isAiGenerated: true,
        conversationId,
        userId: req.user.id
      }
    });
    
    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });
    
    res.status(201).json({
      success: true,
      message: 'AI response generated successfully.',
      data: { message }
    });
  } catch (error) {
    console.error('Generate AI response error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI response.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  generateAiResponse
}; 