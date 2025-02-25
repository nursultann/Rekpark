import { useState, useEffect } from 'react';
import useBusinessQuery from './useBusinessQuery';
import { useToast } from './useToast';

/**
 * Custom hook to fetch and manage the current user's business details
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} Business data, loading state, error state, and business operation functions
 */
function useCurrentUserBusiness(options = {}) {
  const { toast } = useToast();
  const [currentBusiness, setCurrentBusiness] = useState(null);
  
  const {
    businessData,
    businessProfiles,
    businessPlans,
    loading,
    error,
    fetchBusinessPlans,
    fetchBusinessProfiles,
    updateUserBusinessAccount,
    cancelBusinessAccount,
    addPhotoGallery,
    deletePhotoGallery
  } = useBusinessQuery({
    fetchOnMount: true,
    onSuccess: (data) => {
      // If we get a single business object (from a specific fetch)
      if (data && !Array.isArray(data)) {
        setCurrentBusiness(data);
      } 
      // If we get an array of business profiles (from fetchBusinessProfiles)
      else if (Array.isArray(data) && data.length > 0) {
        // Find the active one (not canceled and not ended)
        const activeBusiness = data.find(business => 
          !business.canceled_at && 
          (business.end_at ? new Date(business.end_at) > new Date() : true)
        );
        
        if (activeBusiness) {
          setCurrentBusiness(activeBusiness);
        }
      }
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to fetch business data",
        type: "error",
        variant: "destructive",
      });
      
      if (options.onError) {
        options.onError(err);
      }
    }
  });

  // Initialize by fetching business profiles
  useEffect(() => {
    fetchBusinessProfiles();
    fetchBusinessPlans();
  }, []);

  // Helper function to refresh current business data
  const refreshBusinessData = async () => {
    try {
      await fetchBusinessProfiles();
      toast({
        title: "Success",
        description: "Business data refreshed successfully",
        type: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to refresh business data",
        type: "error",
      });
    }
  };

  // Enhanced update function with better error handling and toast notifications
  const updateBusiness = async (data) => {
    try {
      const updated = await updateUserBusinessAccount(data);
      setCurrentBusiness(updated);
      
      toast({
        title: "Success",
        description: "Business updated successfully",
        type: "success",
      });
      
      return updated;
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update business",
        type: "error",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  // Enhanced cancel function with confirmation and toast notifications
  const cancelBusiness = async (skipConfirmation = false) => {
    if (!skipConfirmation && !window.confirm("Are you sure you want to cancel your business account? This action cannot be undone.")) {
      return false;
    }
    
    try {
      const result = await cancelBusinessAccount();
      
      toast({
        title: "Business Canceled",
        description: "Your business account has been canceled successfully",
        type: "info",
      });
      
      setCurrentBusiness(null);
      return result;
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to cancel business",
        type: "error",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  // Enhanced add gallery function with better error handling and toast notifications
  const addGallery = async (galleryData) => {
    try {
      const result = await addPhotoGallery(galleryData);
      
      toast({
        title: "Gallery Added",
        description: "Photo gallery added successfully",
        type: "success",
      });
      
      // Refresh to get updated data
      await fetchBusinessProfiles();
      
      return result;
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add gallery",
        type: "error",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  // Enhanced delete gallery function with confirmation and toast notifications
  const deleteGallery = async (galleryId, skipConfirmation = false) => {
    if (!skipConfirmation && !window.confirm("Are you sure you want to delete this gallery? This action cannot be undone.")) {
      return false;
    }
    
    try {
      const result = await deletePhotoGallery(galleryId);
      
      toast({
        title: "Gallery Deleted",
        description: "Photo gallery deleted successfully",
        type: "success",
      });
      
      // Refresh to get updated data
      await fetchBusinessProfiles();
      
      return result;
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete gallery",
        type: "error",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  return {
    businessData: currentBusiness,
    businessPlans,
    loading,
    error,
    updateBusiness,
    cancelBusiness,
    addGallery,
    deleteGallery,
    refreshBusinessData,
    hasBusiness: !!currentBusiness
  };
}

export default useCurrentUserBusiness;