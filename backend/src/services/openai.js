const { OpenAI } = require('openai');
const prisma = require('../config/prisma');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an AI response based on conversation history and knowledge base
 * @param {string} conversationId - The ID of the conversation
 * @returns {Promise<string>} - The AI-generated response
 */
const generateResponse = async (conversationId) => {
  try {
    // Get conversation with messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 10 // Get last 10 messages for context
        },
        widget: true
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Get knowledge base entries for the user
    const knowledgeBaseEntries = await prisma.knowledgeBase.findMany({
      where: { userId: conversation.userId }
    });

    // Format conversation history for the prompt
    const conversationHistory = conversation.messages.map(message => {
      const role = message.isFromVisitor ? 'user' : 'assistant';
      return { role, content: message.content };
    });

    // Format knowledge base for the prompt
    let knowledgeBaseContext = '';
    if (knowledgeBaseEntries.length > 0) {
      knowledgeBaseContext = 'Knowledge Base Information:\n';
      knowledgeBaseEntries.forEach(entry => {
        knowledgeBaseContext += `- ${entry.title}: ${entry.content}\n`;
      });
    }

    // Create system message with context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant for ${conversation.widget.name}. 
      Your goal is to provide accurate and helpful responses to user inquiries.
      ${knowledgeBaseContext ? `\n\nHere is some information that might be helpful:\n${knowledgeBaseContext}` : ''}
      
      If you don't know the answer to a question, be honest and say you don't know.
      Keep your responses concise and friendly.`
    };

    // Create messages array for OpenAI API
    const messages = [systemMessage, ...conversationHistory];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    // Return the generated response
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

module.exports = {
  generateResponse
}; 