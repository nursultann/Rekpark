import { useState, useEffect } from 'react';
import axios from '../config/axios_config';

/**
 * A hook to fetch and manage the business profile of the current user
 * 
 * @returns {Object} An object containing the business profile and related functions
 */
const useBusinessProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch the business profile
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('/business/profile');
        setBusinessProfile(response.data.data);
      } catch (err) {
        console.error('Error fetching business profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch business profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinessProfile();
  }, [refreshTrigger]);

  /**
   * Function to refresh the business profile data
   */
  const refreshBusinessProfile = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  /**
   * Function to update business profile metadata
   * 
   * @param {string} key - The metadata key
   * @param {any} value - The metadata value
   * @returns {Promise} A promise that resolves when the update is complete
   */
  const updateMetadata = async (key, value) => {
    try {
      await axios.post('/business/metadata', { key, value });
      refreshBusinessProfile();
      return { success: true };
    } catch (err) {
      console.error('Error updating business metadata:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update business metadata' 
      };
    }
  };

  /**
   * Function to update the business profile
   * 
   * @param {Object} data - The data to update
   * @returns {Promise} A promise that resolves when the update is complete
   */
  const updateBusinessProfile = async (data) => {
    try {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'logotype' || key === 'cover') {
          if (data[key] instanceof File) {
            formData.append(key, data[key]);
          }
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // Set the _method field for Laravel to understand it's a PATCH request
      formData.append('_method', 'PATCH');
      
      await axios.post('/business/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      refreshBusinessProfile();
      return { success: true };
    } catch (err) {
      console.error('Error updating business profile:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update business profile' 
      };
    }
  };
  
  /**
   * Function to cancel the business subscription
   * 
   * @returns {Promise} A promise that resolves when the cancellation is complete
   */
  const cancelBusinessSubscription = async () => {
    try {
      await axios.post('/business/account/cancel');
      refreshBusinessProfile();
      return { success: true };
    } catch (err) {
      console.error('Error cancelling business subscription:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to cancel business subscription' 
      };
    }
  };

  /**
   * Function to add a photo gallery
   * 
   * @param {string} title - The gallery title
   * @param {File[]} images - Array of image files
   * @returns {Promise} A promise that resolves when the gallery is added
   */
  const addPhotoGallery = async (title, images) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      
      // Append each image to formData
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      
      await axios.post('/business/account/photogallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      refreshBusinessProfile();
      return { success: true };
    } catch (err) {
      console.error('Error adding photo gallery:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to add photo gallery' 
      };
    }
  };

  /**
   * Function to delete a photo gallery
   * 
   * @param {number} galleryId - The ID of the gallery to delete
   * @returns {Promise} A promise that resolves when the gallery is deleted
   */
  const deletePhotoGallery = async (galleryId) => {
    try {
      await axios.delete(`/business/account/photogallery/${galleryId}`);
      refreshBusinessProfile();
      return { success: true };
    } catch (err) {
      console.error('Error deleting photo gallery:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete photo gallery' 
      };
    }
  };
  
  // Check if the business profile is active
  const isActive = businessProfile && 
    (!businessProfile.ended_at || new Date(businessProfile.end_at) > new Date()) && 
    !businessProfile.canceled_at;

  // Calculate days remaining in subscription
  const getDaysRemaining = () => {
    if (!businessProfile || !businessProfile.end_at) return 0;
    
    const endDate = new Date(businessProfile.end_at);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Check if a business feature is included in the plan
  const hasFeature = (featureKey) => {
    if (!businessProfile || !businessProfile.features) return false;
    
    return businessProfile.features.some(feature => feature.key === featureKey);
  };
  
  // Get a specific extra value by key
  const getExtraValue = (key) => {
    if (!businessProfile || !businessProfile.extras) return null;
    
    const extra = businessProfile.extras.find(item => item.key === key);
    return extra ? extra.value : null;
  };

  return {
    businessProfile,
    loading,
    error,
    isActive,
    refreshBusinessProfile,
    updateMetadata,
    updateBusinessProfile,
    cancelBusinessSubscription,
    addPhotoGallery,
    deletePhotoGallery,
    getDaysRemaining,
    hasFeature,
    getExtraValue
  };
};

export default useBusinessProfile;