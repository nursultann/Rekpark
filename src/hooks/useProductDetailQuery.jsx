import { useState, useEffect, useCallback } from 'react';
import axios from '../config/axios_config';

const useProductDetail = (productId, initialOptions = {}) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [options] = useState({
    includeSubscriptions: false,
    includeCategoryTree: false,
    ...initialOptions
  });

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch product details
      const params = {};
      if (options.includeCategoryTree) {
        params.category_parents_tree = true;
      }

      const response = await axios.get(`/products/${productId}`, { params });
      setProduct(response.data.data);

      // Fetch subscriptions if enabled
      if (options.includeSubscriptions) {
        const subsResponse = await axios.get(`/products/${productId}/subscriptions`);
        setSubscriptions(subsResponse.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  }, [productId, options.includeCategoryTree, options.includeSubscriptions]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async () => {
    if (!product) return;

    try {
      if (product.is_favorite) {
        await axios.post(`/products/${productId}/remfromfav`);
      } else {
        await axios.post(`/products/${productId}/addtofav`);
      }

      setProduct(prev => ({
        ...prev,
        is_favorite: !prev.is_favorite
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update favorite status');
    }
  }, [product, productId]);

  // Update product status
  const updateStatus = useCallback(async (newStatus) => {
    if (!product) return;

    try {
      let response;
      switch (newStatus) {
        case 'active':
          response = await axios.post(`/products/${productId}/activate`);
          break;
        case 'inactive':
          response = await axios.post(`/products/${productId}/deactivate`);
          break;
        case 'disabled':
          response = await axios.post(`/products/${productId}/disable`);
          break;
        default:
          throw new Error('Invalid status');
      }

      setProduct(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product status');
    }
  }, [product, productId]);

  // Apply subscription features
  const applySubscription = useCallback(async (subscriptionType, options = {}) => {
    if (!product) return;

    try {
      let endpoint;
      switch (subscriptionType) {
        case 'vip':
          endpoint = 'makevip';
          break;
        case 'top':
          endpoint = 'maketop';
          break;
        case 'colored':
          endpoint = 'makecolored';
          break;
        case 'urgent':
          endpoint = 'makeurgent';
          break;
        case 'autoup':
          endpoint = 'makeautoup';
          break;
        default:
          throw new Error('Invalid subscription type');
      }

      const response = await axios.post(`/products/${productId}/${endpoint}`, options);
      
      // Refresh subscriptions
      if (options.includeSubscriptions) {
        const subsResponse = await axios.get(`/products/${productId}/subscriptions`);
        setSubscriptions(subsResponse.data.data);
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply subscription');
      throw err;
    }
  }, [product, productId, options.includeSubscriptions]);

  // Delete product
  const deleteProduct = useCallback(async () => {
    if (!product) return;

    try {
      await axios.delete(`/products/${productId}`);
      setProduct(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      return false;
    }
  }, [product, productId]);

  // Fetch product on mount and when productId changes
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    subscriptions,
    toggleFavorite,
    updateStatus,
    applySubscription,
    deleteProduct,
    refetch: fetchProduct
  };
};

export default useProductDetail;