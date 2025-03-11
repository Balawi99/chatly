const prisma = require('../config/prisma');

/**
 * Get all widgets for the current user
 */
const getWidgets = async (req, res) => {
  try {
    const widgets = await prisma.widget.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({
      success: true,
      data: { widgets }
    });
  } catch (error) {
    console.error('Get widgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching widgets.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a single widget by ID
 */
const getWidget = async (req, res) => {
  try {
    const { id } = req.params;
    
    const widget = await prisma.widget.findUnique({
      where: { id }
    });
    
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found.'
      });
    }
    
    // Check if widget belongs to user
    if (widget.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this widget.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { widget }
    });
  } catch (error) {
    console.error('Get widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching widget.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new widget
 */
const createWidget = async (req, res) => {
  try {
    const { name, color, position, welcomeMessage } = req.body;
    
    const widget = await prisma.widget.create({
      data: {
        name,
        color: color || undefined,
        position: position || undefined,
        welcomeMessage: welcomeMessage || undefined,
        userId: req.user.id
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Widget created successfully.',
      data: { widget }
    });
  } catch (error) {
    console.error('Create widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating widget.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a widget
 */
const updateWidget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, position, welcomeMessage } = req.body;
    
    // Check if widget exists and belongs to user
    const existingWidget = await prisma.widget.findUnique({
      where: { id }
    });
    
    if (!existingWidget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found.'
      });
    }
    
    if (existingWidget.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this widget.'
      });
    }
    
    // Update widget
    const updatedWidget = await prisma.widget.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(position && { position }),
        ...(welcomeMessage && { welcomeMessage })
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Widget updated successfully.',
      data: { widget: updatedWidget }
    });
  } catch (error) {
    console.error('Update widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating widget.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a widget
 */
const deleteWidget = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if widget exists and belongs to user
    const existingWidget = await prisma.widget.findUnique({
      where: { id }
    });
    
    if (!existingWidget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found.'
      });
    }
    
    if (existingWidget.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this widget.'
      });
    }
    
    // Delete widget
    await prisma.widget.delete({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Widget deleted successfully.'
    });
  } catch (error) {
    console.error('Delete widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting widget.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get widget by public ID (for embedding)
 */
const getPublicWidget = async (req, res) => {
  try {
    const { id } = req.params;
    
    const widget = await prisma.widget.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        color: true,
        position: true,
        welcomeMessage: true
      }
    });
    
    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { widget }
    });
  } catch (error) {
    console.error('Get public widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching widget.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getWidgets,
  getWidget,
  createWidget,
  updateWidget,
  deleteWidget,
  getPublicWidget
}; 