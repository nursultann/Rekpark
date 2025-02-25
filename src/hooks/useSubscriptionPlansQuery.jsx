import { useState, useEffect } from 'react';
import axios from '../config/axios_config';

/**
 * A custom React hook for fetching and managing subscription plans data
 * 
 * @param {Object} options - Configuration options for the hook
 * @param {boolean} options.fetchOnMount - Whether to fetch data when component mounts
 * @param {string} options.planType - Type of plan to fetch ('vip', 'top', 'urgent', 'colored', 'auto_up')
 * @param {boolean} options.isActive - Filter for active plans only
 * @param {function} options.onSuccess - Callback function to execute when fetch succeeds
 * @param {function} options.onError - Callback function to execute when fetch fails
 * @returns {Object} Object containing data, loading state, error state, and refetch function
 */
const useSubscriptionPlansQuery = (options = {}) => {
  const {
    fetchOnMount = true,
    planType = '',
    isActive = true,
    onSuccess = () => {},
    onError = () => {}
  } = options;

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches subscription plans from the API
   * 
   * @param {Object} params - Query parameters to send with the request
   * @returns {Promise} Promise that resolves with the fetched data
   */
  const fetchPlans = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const queryParams = {
        ...params
      };
      
      if (planType) {
        queryParams.name = planType;
      }
      
      if (isActive !== undefined) {
        queryParams.is_active = isActive ? 1 : 0;
      }

      // Make the API call
      const response = await axios.get('/subscription/plans', {
        params: queryParams
      });

      const data = response.data.data || [];
      setPlans(data);
      setLoading(false);
      onSuccess(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch subscription plans';
      setError(errorMessage);
      setLoading(false);
      onError(err);
      return [];
    }
  };

  /**
   * Apply subscription plan to a product
   * 
   * @param {number} productId - ID of the product
   * @param {number} planId - ID of the subscription plan
   * @param {Object} data - Additional data to send with the request
   * @returns {Promise} Promise that resolves with the response data
   */
  const applyPlanToProduct = async (productId, planId, data = {}) => {
    setLoading(true);
    
    try {
      let endpoint;
      
      // Determine the endpoint based on the plan type
      switch (data.planType || planType) {
        case 'vip':
          endpoint = `/products/${productId}/makevip`;
          break;
        case 'top':
          endpoint = `/products/${productId}/maketop`;
          break;
        case 'urgent':
          endpoint = `/products/${productId}/makeurgent`;
          break;
        case 'colored':
          endpoint = `/products/${productId}/makecolored`;
          break;
        case 'auto_up':
          endpoint = `/products/${productId}/makeautoup`;
          break;
        default:
          throw new Error('Invalid plan type');
      }
      
      const response = await axios.post(endpoint, {
        plan_id: planId,
        ...data
      });
      
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to apply subscription plan';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Check if a product has an active subscription plan
   * 
   * @param {number} productId - ID of the product
   * @returns {Promise} Promise that resolves with the subscription data
   */
  const checkProductSubscription = async (productId) => {
    try {
      const response = await axios.get(`/api/products/${productId}/subscriptions`);
      return response.data.data || {};
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to check product subscription';
      setError(errorMessage);
      throw err;
    }
  };

  // Fetch plans on mount if enabled
  useEffect(() => {
    if (fetchOnMount) {
      fetchPlans();
    }
  }, [fetchOnMount]);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    applyPlanToProduct,
    checkProductSubscription
  };
};

export default useSubscriptionPlansQuery;