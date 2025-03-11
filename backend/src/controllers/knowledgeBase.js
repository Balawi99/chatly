const prisma = require('../config/prisma');
const fileProcessor = require('../services/fileProcessor');
const webScraper = require('../services/webScraper');

/**
 * Get all knowledge base entries for the current user
 */
const getKnowledgeBaseEntries = async (req, res) => {
  try {
    const entries = await prisma.knowledgeBase.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });
    
    res.status(200).json({
      success: true,
      data: { entries }
    });
  } catch (error) {
    console.error('Get knowledge base entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching knowledge base entries.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a single knowledge base entry by ID
 */
const getKnowledgeBaseEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const entry = await prisma.knowledgeBase.findUnique({
      where: { id }
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge base entry not found.'
      });
    }
    
    // Check if entry belongs to user
    if (entry.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this knowledge base entry.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Get knowledge base entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching knowledge base entry.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new knowledge base entry
 */
const createKnowledgeBaseEntry = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const entry = await prisma.knowledgeBase.create({
      data: {
        title,
        content,
        userId: req.user.id
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Knowledge base entry created successfully.',
      data: { entry }
    });
  } catch (error) {
    console.error('Create knowledge base entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating knowledge base entry.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a knowledge base entry
 */
const updateKnowledgeBaseEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // Check if entry exists and belongs to user
    const existingEntry = await prisma.knowledgeBase.findUnique({
      where: { id }
    });
    
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge base entry not found.'
      });
    }
    
    if (existingEntry.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this knowledge base entry.'
      });
    }
    
    // Update entry
    const updatedEntry = await prisma.knowledgeBase.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content })
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Knowledge base entry updated successfully.',
      data: { entry: updatedEntry }
    });
  } catch (error) {
    console.error('Update knowledge base entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating knowledge base entry.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a knowledge base entry
 */
const deleteKnowledgeBaseEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if entry exists and belongs to user
    const existingEntry = await prisma.knowledgeBase.findUnique({
      where: { id }
    });
    
    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge base entry not found.'
      });
    }
    
    if (existingEntry.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this knowledge base entry.'
      });
    }
    
    // Delete entry
    await prisma.knowledgeBase.delete({
      where: { id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Knowledge base entry deleted successfully.'
    });
  } catch (error) {
    console.error('Delete knowledge base entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting knowledge base entry.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Upload a file to extract content for the knowledge base
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.'
      });
    }

    // Process the file and extract text
    const extractedText = await fileProcessor.processFile(req.file);
    
    // Split text into manageable chunks
    const chunks = fileProcessor.splitTextIntoChunks(extractedText);
    
    // Create knowledge base entries from chunks
    const entries = [];
    for (let i = 0; i < chunks.length; i++) {
      const entry = await prisma.knowledgeBase.create({
        data: {
          title: `${req.file.originalname} - Part ${i + 1}`,
          content: chunks[i],
          userId: req.user.id
        }
      });
      entries.push(entry);
    }
    
    res.status(201).json({
      success: true,
      message: `File processed successfully. Created ${entries.length} knowledge base entries.`,
      data: { entries }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing file.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Scrape a URL and add content to knowledge base
 */
const scrapeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required.'
      });
    }
    
    // Process the URL and create knowledge base entries
    const entries = await webScraper.processUrl(url, req.user.id, prisma);
    
    res.status(201).json({
      success: true,
      message: `URL scraped successfully. Created ${entries.length} knowledge base entries.`,
      data: { entries }
    });
  } catch (error) {
    console.error('Scrape URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scraping URL.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getKnowledgeBaseEntries,
  getKnowledgeBaseEntry,
  createKnowledgeBaseEntry,
  updateKnowledgeBaseEntry,
  deleteKnowledgeBaseEntry,
  uploadFile,
  scrapeUrl
}; 