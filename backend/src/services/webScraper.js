const axios = require('axios');
const cheerio = require('cheerio');
const { splitTextIntoChunks } = require('./fileProcessor');

/**
 * Extract text content from a URL
 * @param {string} url - The URL to scrape
 * @returns {Promise<Object>} - Object containing title and content
 */
const scrapeUrl = async (url) => {
  try {
    // Validate URL
    const urlObj = new URL(url);
    
    // Make request to the URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Load HTML into cheerio
    const $ = cheerio.load(response.data);
    
    // Get page title
    const title = $('title').text().trim() || urlObj.hostname;
    
    // Extract main content
    // Remove script, style, and other non-content elements
    $('script, style, nav, footer, header, aside, iframe, noscript').remove();
    
    // Get text from main content areas
    let content = '';
    
    // Try to find main content container
    const mainSelectors = ['main', 'article', '.content', '#content', '.main', '#main'];
    let mainContent = null;
    
    for (const selector of mainSelectors) {
      if ($(selector).length > 0) {
        mainContent = $(selector);
        break;
      }
    }
    
    // If main content container found, extract text from it
    if (mainContent) {
      content = mainContent.text();
    } else {
      // Otherwise, extract text from paragraphs
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 0) {
          content += text + '\n\n';
        }
      });
      
      // If still no content, extract text from body
      if (content.trim().length === 0) {
        content = $('body').text();
      }
    }
    
    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .replace(/\n\s*\n/g, '\n\n')  // Replace multiple newlines with double newlines
      .trim();
    
    return {
      title,
      content,
      url
    };
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
};

/**
 * Process a URL and extract content for knowledge base
 * @param {string} url - The URL to process
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of created knowledge base entries
 */
const processUrl = async (url, userId, prisma) => {
  try {
    // Scrape the URL
    const { title, content, url: scrapedUrl } = await scrapeUrl(url);
    
    // Split content into chunks
    const chunks = splitTextIntoChunks(content);
    
    // Create knowledge base entries
    const entries = [];
    for (let i = 0; i < chunks.length; i++) {
      const entryTitle = chunks.length > 1 
        ? `${title} - Part ${i + 1} (${scrapedUrl})` 
        : `${title} (${scrapedUrl})`;
      
      const entry = await prisma.knowledgeBase.create({
        data: {
          title: entryTitle,
          content: chunks[i],
          userId
        }
      });
      
      entries.push(entry);
    }
    
    return entries;
  } catch (error) {
    console.error('Error processing URL:', error);
    throw error;
  }
};

module.exports = {
  scrapeUrl,
  processUrl
}; 