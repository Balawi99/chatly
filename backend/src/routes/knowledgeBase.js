const express = require('express');
const { 
  getKnowledgeBaseEntries, 
  getKnowledgeBaseEntry, 
  createKnowledgeBaseEntry, 
  updateKnowledgeBaseEntry, 
  deleteKnowledgeBaseEntry,
  uploadFile,
  scrapeUrl
} = require('../controllers/knowledgeBase');
const { authenticate } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Knowledge base routes
router.get('/', getKnowledgeBaseEntries);
router.get('/:id', getKnowledgeBaseEntry);
router.post('/', createKnowledgeBaseEntry);
router.put('/:id', updateKnowledgeBaseEntry);
router.delete('/:id', deleteKnowledgeBaseEntry);

// File upload route
router.post('/upload', upload.single('file'), handleUploadError, uploadFile);

// URL scraping route
router.post('/scrape', scrapeUrl);

module.exports = router; 