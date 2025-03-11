import { useState, useEffect } from 'react';
import axios from '../config/axios_config';

/**
 * A custom React hook for handling business account operations
 * 
 * @param {Object} options - Configuration options for the hook
 * @param {boolean} options.fetchOnMount - Whether to fetch business data when component mounts
 * @param {number} options.businessId - ID of the specific business to fetch
 * @param {function} options.onSuccess - Callback function to execute when operations succeed
 * @param {function} options.onError - Callback function to execute when operations fail
 * @returns {Object} Object containing data, loading state, error state, and business operation functions
 */
const useBusinessQuery = (options = {}) => {
  const {
    fetchOnMount = true,
    businessId = null,
    onSuccess = () => {},
    onError = () => {}
  } = options;

  const [businessData, setBusinessData] = useState(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [businessPlans, setBusinessPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches business plans from the API
   * 
   * @param {Object} params - Query parameters to send with the request
   * @returns {Promise} Promise that resolves with the fetched business plans
   */
  const fetchBusinessPlans = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/business/plans', {
        params: {
            'with': 'features',
            ...params
        }
      });

      const data = response.data.data || [];
      setBusinessPlans(data);
      setLoading(false);
      onSuccess(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch business plans';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      return [];
    }
  };

  /**
   * Fetches current user's business profiles
   * 
   * @returns {Promise} Promise that resolves with the fetched business profiles
   */
  const fetchBusinessProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/business/profiles');
      const data = response.data.data || [];
      setBusinessProfiles(data);
      setLoading(false);
      onSuccess(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch business profiles';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      return [];
    }
  };

  /**
   * Fetches a specific business profile by ID
   * 
   * @param {number} id - ID of the business profile to fetch
   * @returns {Promise} Promise that resolves with the fetched business profile
   */
  const fetchBusinessProfile = async (id) => {
    const businessIdToFetch = id || businessId;
    if (!businessIdToFetch) {
      setError('Business ID is required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/business/profiles/${businessIdToFetch}`);
      const data = response.data.data;
      setBusinessData(data);
      setLoading(false);
      onSuccess(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch business profile';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      return null;
    }
  };

  /**
   * Creates a new business account subscription
   * 
   * @param {Object} data - Business account data to send with the request
   * @returns {Promise} Promise that resolves with the created business account
   */
  const createBusinessAccount = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Create form data for handling file uploads
      const formData = new FormData();
      
      // Add all fields to form data
      Object.keys(data).forEach(key => {
        // Handle file uploads
        if (key === 'logotype' || key === 'cover') {
          if (data[key] && data[key] instanceof File) {
            formData.append(key, data[key]);
          }
        } 
        // Handle nested objects like schedule and socials
        else if (typeof data[key] === 'object' && data[key] !== null && !(data[key] instanceof File)) {
          formData.append(key, JSON.stringify(data[key]));
        } 
        // Handle regular fields
        else {
          formData.append(key, data[key]);
        }
      });

      const response = await axios.post('/business/account', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const responseData = response.data.data;
      setBusinessData(responseData);
      setLoading(false);
      onSuccess(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create business account';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      throw err;
    }
  };

  /**
   * Updates an existing business account
   * 
   * @param {Object} data - Updated business account data
   * @param {number} id - ID of the business to update (optional if businessId is provided in hook options)
   * @returns {Promise} Promise that resolves with the updated business account
   */
  const updateBusinessAccount = async (data, id = null) => {
    const businessIdToUpdate = id || businessId || data.id;
    if (!businessIdToUpdate) {
      setError('Business ID is required for update');
      throw new Error('Business ID is required for update');
    }

    setLoading(true);
    setError(null);

    try {
      // Create form data for handling file uploads
      const formData = new FormData();
      
      // Add all fields to form data
      Object.keys(data).forEach(key => {
        // Handle file uploads
        if (key === 'logotype' || key === 'cover') {
          if (data[key] && data[key] instanceof File) {
            formData.append(key, data[key]);
          }
        } 
        // Handle nested objects like schedule and socials
        else if (typeof data[key] === 'object' && data[key] !== null && !(data[key] instanceof File)) {
          formData.append(key, JSON.stringify(data[key]));
        } 
        // Handle regular fields
        else {
          formData.append(key, data[key]);
        }
      });

      // Add _method field to simulate PUT request
      formData.append('_method', 'PATCH');

      const response = await axios.post(`/business/${businessIdToUpdate}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const responseData = response.data.data;
      setBusinessData(responseData);
      setLoading(false);
      onSuccess(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update business account';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      throw err;
    }
  };

  /**
   * Updates the current user's business account
   * 
   * @param {Object} data - Updated business account data
   * @returns {Promise} Promise that resolves with the updated business account
   */
  const updateUserBusinessAccount = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Create form data for handling file uploads
      const formData = new FormData();
      
      // Add all fields to form data
      Object.keys(data).forEach(key => {
        // Handle file uploads
        if (key === 'logotype' || key === 'cover') {
          if (data[key] && data[key] instanceof File) {
            formData.append(key, data[key]);
          }
        } 
        // Handle nested objects like schedule and socials
        else if (typeof data[key] === 'object' && data[key] !== null && !(data[key] instanceof File)) {
          formData.append(key, JSON.stringify(data[key]));
        } 
        // Handle regular fields
        else {
          formData.append(key, data[key]);
        }
      });

      // Add _method field to simulate PATCH request
      formData.append('_method', 'PATCH');

      const response = await axios.post('/business/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const responseData = response.data.data;
      setBusinessData(responseData);
      setLoading(false);
      onSuccess(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update business account';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      throw err;
    }
  };

  /**
   * Cancels a business account subscription
   * 
   * @returns {Promise} Promise that resolves with the cancelled business account
   */
  const cancelBusinessAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/business/account/cancel');
      const responseData = response.data.data;
      setBusinessData(responseData);
      setLoading(false);
      onSuccess(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel business account';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      throw err;
    }
  };

  /**
   * Adds a photo gallery to a business account
   * 
   * @param {Object} data - Photo gallery data
   * @returns {Promise} Promise that resolves with the response data
   */
  const addPhotoGallery = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Create form data for handling file uploads
      const formData = new FormData();
      
      // Add title to form data
      formData.append('title', data.title || '');
      
      // Add images to form data
      if (data.images && Array.isArray(data.images)) {
        data.images.forEach(image => {
          formData.append('images[]', image);
        });
      }

      const response = await axios.post('/business/account/photogallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setLoading(false);
      onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add photo gallery';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      throw err;
    }
  };

  /**
   * Deletes a photo gallery from a business account
   * 
   * @param {number} galleryId - ID of the gallery to delete
   * @returns {Promise} Promise that resolves with the response data
   */
  const deletePhotoGallery = async (galleryId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/business/account/photogallery/${galleryId}`);
      setLoading(false);
      onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete photo gallery';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      throw err;
    }
  };

  // Fetch data on mount if enabled
  useEffect(() => {
    if (fetchOnMount) {
      if (businessId) {
        fetchBusinessProfile(businessId);
      } else {
        fetchBusinessProfiles();
      }
    }
  }, [fetchOnMount, businessId]);

  return {
    businessData,
    businessProfiles,
    businessPlans,
    loading,
    error,
    fetchBusinessPlans,
    fetchBusinessProfiles,
    fetchBusinessProfile,
    createBusinessAccount,
    updateBusinessAccount,
    updateUserBusinessAccount,
    cancelBusinessAccount,
    addPhotoGallery,
    deletePhotoGallery
  };
};

export default useBusinessQuery;