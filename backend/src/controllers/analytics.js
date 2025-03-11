const prisma = require('../config/prisma');

/**
 * Get dashboard analytics
 */
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total counts
    const totalWidgets = await prisma.widget.count({
      where: { userId }
    });
    
    const totalConversations = await prisma.conversation.count({
      where: { userId }
    });
    
    const totalMessages = await prisma.message.count({
      where: {
        conversation: {
          userId
        }
      }
    });
    
    const totalAiMessages = await prisma.message.count({
      where: {
        isAiGenerated: true,
        conversation: {
          userId
        }
      }
    });
    
    const totalVisitorMessages = await prisma.message.count({
      where: {
        isFromVisitor: true,
        conversation: {
          userId
        }
      }
    });
    
    // Get recent conversations
    const recentConversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        widget: {
          select: { name: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    // Get conversation count by date (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const conversationsByDate = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date, 
        COUNT(*) as count 
      FROM Conversation 
      WHERE userId = ${userId} 
        AND createdAt >= ${sevenDaysAgo.toISOString()} 
      GROUP BY DATE(createdAt) 
      ORDER BY date ASC
    `;
    
    // Get message count by type
    const messagesByType = [
      { type: 'AI Generated', count: totalAiMessages },
      { type: 'Visitor', count: totalVisitorMessages },
      { type: 'Admin', count: totalMessages - totalAiMessages - totalVisitorMessages }
    ];
    
    // Get widget performance
    const widgetPerformance = await prisma.widget.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        _count: {
          select: { conversations: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const formattedWidgetPerformance = widgetPerformance.map(widget => ({
      id: widget.id,
      name: widget.name,
      conversationCount: widget._count.conversations
    }));
    
    res.status(200).json({
      success: true,
      data: {
        totalWidgets,
        totalConversations,
        totalMessages,
        totalAiMessages,
        totalVisitorMessages,
        recentConversations,
        conversationsByDate,
        messagesByType,
        widgetPerformance: formattedWidgetPerformance
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get widget analytics
 */
const getWidgetAnalytics = async (req, res) => {
  try {
    const { widgetId } = req.params;
    const userId = req.user.id;
    
    // Check if widget exists and belongs to user
    const widget = await prisma.widget.findUnique({
      where: { id: widgetId }
    });
    
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found.'
      });
    }
    
    if (widget.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this widget.'
      });
    }
    
    // Get total conversations for this widget
    const totalConversations = await prisma.conversation.count({
      where: { widgetId }
    });
    
    // Get total messages for this widget
    const totalMessages = await prisma.message.count({
      where: {
        conversation: {
          widgetId
        }
      }
    });
    
    // Get message types for this widget
    const totalAiMessages = await prisma.message.count({
      where: {
        isAiGenerated: true,
        conversation: {
          widgetId
        }
      }
    });
    
    const totalVisitorMessages = await prisma.message.count({
      where: {
        isFromVisitor: true,
        conversation: {
          widgetId
        }
      }
    });
    
    // Get conversation count by date (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const conversationsByDate = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date, 
        COUNT(*) as count 
      FROM Conversation 
      WHERE widgetId = ${widgetId} 
        AND createdAt >= ${thirtyDaysAgo.toISOString()} 
      GROUP BY DATE(createdAt) 
      ORDER BY date ASC
    `;
    
    // Get message count by type
    const messagesByType = [
      { type: 'AI Generated', count: totalAiMessages },
      { type: 'Visitor', count: totalVisitorMessages },
      { type: 'Admin', count: totalMessages - totalAiMessages - totalVisitorMessages }
    ];
    
    res.status(200).json({
      success: true,
      data: {
        widget,
        totalConversations,
        totalMessages,
        totalAiMessages,
        totalVisitorMessages,
        conversationsByDate,
        messagesByType
      }
    });
  } catch (error) {
    console.error('Get widget analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching widget analytics.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getWidgetAnalytics
}; 