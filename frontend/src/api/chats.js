import apiClient from './client';

/**
 * Get all conversations for the current user
 * @returns {Promise} - API response
 */
export const getConversations = async () => {
  try {
    const response = await apiClient.get('/chats/conversations');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get a single conversation by ID with messages
 * @param {string} id - Conversation ID
 * @returns {Promise} - API response
 */
export const getConversation = async (id) => {
  try {
    const response = await apiClient.get(`/chats/conversations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Create a new conversation (usually from widget)
 * @param {Object} conversationData - Conversation data
 * @returns {Promise} - API response
 */
export const createConversation = async (conversationData) => {
  try {
    const response = await apiClient.post('/chats/conversations', conversationData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Send a message in a conversation
 * @param {string} conversationId - Conversation ID
 * @param {Object} messageData - Message data
 * @returns {Promise} - API response
 */
export const sendMessage = async (conversationId, messageData) => {
  try {
    const response = await apiClient.post(`/chats/conversations/${conversationId}/messages`, messageData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Generate AI response to a message
 * @param {string} conversationId - Conversation ID
 * @returns {Promise} - API response
 */
export const generateAiResponse = async (conversationId) => {
  try {
    const response = await apiClient.post(`/chats/conversations/${conversationId}/ai-response`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}; 