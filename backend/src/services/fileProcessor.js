const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Extract text from a PDF file
 * @param {Buffer} pdfBuffer - The PDF file buffer
 * @returns {Promise<string>} - The extracted text
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from a text file
 * @param {Buffer} textBuffer - The text file buffer
 * @returns {string} - The extracted text
 */
const extractTextFromTXT = (textBuffer) => {
  return textBuffer.toString('utf8');
};

/**
 * Process a file and extract its content
 * @param {Object} file - The file object from multer
 * @returns {Promise<string>} - The extracted text
 */
const processFile = async (file) => {
  try {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileBuffer = fs.readFileSync(file.path);
    
    let extractedText = '';
    
    switch (fileExtension) {
      case '.pdf':
        extractedText = await extractTextFromPDF(fileBuffer);
        break;
      case '.txt':
        extractedText = extractTextFromTXT(fileBuffer);
        break;
      default:
        throw new Error('Unsupported file type');
    }
    
    // Clean up the temporary file
    fs.unlinkSync(file.path);
    
    return extractedText;
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
};

/**
 * Split text into chunks for knowledge base entries
 * @param {string} text - The text to split
 * @param {number} maxLength - Maximum length of each chunk
 * @returns {Array<string>} - Array of text chunks
 */
const splitTextIntoChunks = (text, maxLength = 1000) => {
  // Split by paragraphs first
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed maxLength, save current chunk and start a new one
    if (currentChunk.length + paragraph.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    
    // If the paragraph itself is longer than maxLength, split it into sentences
    if (paragraph.length > maxLength) {
      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxLength && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        currentChunk += sentence + ' ';
      }
    } else {
      currentChunk += paragraph + '\n\n';
    }
  }
  
  // Add the last chunk if it's not empty
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

module.exports = {
  processFile,
  splitTextIntoChunks
}; 