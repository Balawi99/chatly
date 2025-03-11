import apiClient from './client';

/**
 * Get all knowledge base entries for the current user
 * @returns {Promise} - API response
 */
export const getKnowledgeBaseEntries = async () => {
  try {
    const response = await apiClient.get('/knowledge-base');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get a single knowledge base entry by ID
 * @param {string} id - Knowledge base entry ID
 * @returns {Promise} - API response
 */
export const getKnowledgeBaseEntry = async (id) => {
  try {
    const response = await apiClient.get(`/knowledge-base/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Create a new knowledge base entry
 * @param {Object} entryData - Knowledge base entry data
 * @returns {Promise} - API response
 */
export const createKnowledgeBaseEntry = async (entryData) => {
  try {
    const response = await apiClient.post('/knowledge-base', entryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Update a knowledge base entry
 * @param {string} id - Knowledge base entry ID
 * @param {Object} entryData - Knowledge base entry data to update
 * @returns {Promise} - API response
 */
export const updateKnowledgeBaseEntry = async (id, entryData) => {
  try {
    const response = await apiClient.put(`/knowledge-base/${id}`, entryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Delete a knowledge base entry
 * @param {string} id - Knowledge base entry ID
 * @returns {Promise} - API response
 */
export const deleteKnowledgeBaseEntry = async (id) => {
  try {
    const response = await apiClient.delete(`/knowledge-base/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}; 