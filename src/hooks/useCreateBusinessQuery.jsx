import axios from '../config/axios_config';

/**
 * Creates a new business account with the provided data
 * 
 * @param {Object} businessData - The business data for creating a new business account
 * @param {number} businessData.plan_id - ID of the selected business plan
 * @param {string} businessData.name - Business name
 * @param {string} businessData.description - Business description
 * @param {string|Array} businessData.phones - Contact phone numbers (string or array)
 * @param {string} [businessData.whatsapp] - WhatsApp number
 * @param {string} [businessData.site] - Business website URL
 * @param {string} [businessData.email] - Business email address
 * @param {Object} [businessData.socials] - Social media profiles
 * @param {Object} businessData.schedule - Business operating hours
 * @param {string} [businessData.address] - Business physical address
 * @param {Object} [businessData.location] - Geographic coordinates
 * @param {File} [businessData.logotype] - Business logo file
 * @param {File} [businessData.cover] - Business cover image file
 * @param {number} [businessData.period] - Subscription period
 * @param {number} [businessData.period_id] - ID of the selected period option
 * @returns {Promise<Object>} Promise resolving to the created business account data
 */
const createBusinessQuery = async (businessData) => {
  try {
    // Create form data for handling file uploads
    const formData = new FormData();
    
    // Add all fields to form data
    Object.keys(businessData).forEach(key => {
      // Handle file uploads
      if (key === 'logotype' || key === 'cover') {
        if (businessData[key] && businessData[key] instanceof File) {
          formData.append(key, businessData[key]);
        }
      } 
      // Handle nested objects like schedule and socials
      else if (typeof businessData[key] === 'object' && businessData[key] !== null && !(businessData[key] instanceof File)) {
        formData.append(key, JSON.stringify(businessData[key]));
      } 
      // Handle arrays (like phones)
      else if (Array.isArray(businessData[key])) {
        formData.append(key, JSON.stringify(businessData[key]));
      }
      // Handle regular fields
      else {
        formData.append(key, businessData[key]);
      }
    });

    const response = await axios.post('/business/account', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  } catch (error) {
    // Extract error message from response if available
    const errorMessage = error.response?.data?.message || 'Failed to create business account';
    
    // Create enhanced error object with the original error and additional information
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.statusCode = error.response?.status;
    enhancedError.responseData = error.response?.data;
  }
};

export default createBusinessQuery;