import apiClient from './client';

/**
 * Get all widgets for the current user
 * @returns {Promise} - API response
 */
export const getWidgets = async () => {
  try {
    const response = await apiClient.get('/widgets');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get a single widget by ID
 * @param {string} id - Widget ID
 * @returns {Promise} - API response
 */
export const getWidget = async (id) => {
  try {
    const response = await apiClient.get(`/widgets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Create a new widget
 * @param {Object} widgetData - Widget data
 * @returns {Promise} - API response
 */
export const createWidget = async (widgetData) => {
  try {
    const response = await apiClient.post('/widgets', widgetData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Update a widget
 * @param {string} id - Widget ID
 * @param {Object} widgetData - Widget data to update
 * @returns {Promise} - API response
 */
export const updateWidget = async (id, widgetData) => {
  try {
    const response = await apiClient.put(`/widgets/${id}`, widgetData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Delete a widget
 * @param {string} id - Widget ID
 * @returns {Promise} - API response
 */
export const deleteWidget = async (id) => {
  try {
    const response = await apiClient.delete(`/widgets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get widget by public ID (for embedding)
 * @param {string} id - Widget ID
 * @returns {Promise} - API response
 */
export const getPublicWidget = async (id) => {
  try {
    const response = await apiClient.get(`/widgets/public/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}; 