import { useState, useCallback, useEffect } from 'react';
import axios from '../../config/axios_config';

const useEditProductQuery = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Fetch product details
  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/products/${productId}`,
        { params: { 'with': 'category;region;city;currency;media;customAttributeValues' } }
      );
      setProduct(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Update product
  const updateProduct = useCallback(async (productData) => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Prepare form data for multipart submission
      const formData = new FormData();
      formData.append('_method', 'PATCH'); // Laravel requirement for PUT/PATCH requests

      // Add basic product data
      const basicFields = [
        'title',
        'description',
        'price',
        'category_id',
        'currency_id',
        'region_id',
        'city_id',
        'district',
        'location',
        'video'
      ];

      basicFields.forEach(field => {
        if (productData[field] !== undefined && productData[field] !== null) {
          formData.append(field, productData[field]);
        }
      });

      // Handle phones array
      if (productData.phones) {
        formData.append('phones', JSON.stringify(productData.phones));
      }

      // Handle contacts array if present
      if (productData.contacts) {
        formData.append('contacts', JSON.stringify(productData.contacts));
      }

      // Handle custom attributes
      if (productData.custom_attribute_values?.length > 0) {
        formData.append(
          'custom_attribute_values',
          JSON.stringify(productData.custom_attribute_values)
        );
      }

      // Handle car attributes if present
      if (productData.car_attributes && Object.keys(productData.car_attributes).length > 0) {
        formData.append(
          'car_attributes',
          JSON.stringify(productData.car_attributes)
        );
      }

      // Handle image uploads
      if (productData.images?.length > 0) {
        productData.images.forEach(image => {
          formData.append('images[]', image);
        });
      }

      // Handle deleted images
      if (productData.deleted_image_ids?.length > 0) {
        formData.append('deleted_image_ids', JSON.stringify(productData.deleted_image_ids));
      }

      const response = await axios.post(`/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      setProduct(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [productId]);

  // Delete product image
  const deleteImage = useCallback(async (imageId) => {
    if (!productId || !imageId) return;

    try {
      await axios.delete(`/products/${productId}/images/${imageId}`);
      
      // Update local product state
      setProduct(prev => ({
        ...prev,
        media: prev.media.filter(media => media.id !== imageId)
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete image';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [productId]);

  // Update product status
  const updateStatus = useCallback(async (status) => {
    if (!productId || !status) return;

    try {
      const endpoint = {
        active: 'activate',
        inactive: 'deactivate',
        disabled: 'disable'
      }[status];

      if (!endpoint) throw new Error('Invalid status');

      const response = await axios.post(`/products/${productId}/${endpoint}`);
      setProduct(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [productId]);

  // Delete product
  const deleteProduct = useCallback(async () => {
    if (!productId) return;

    try {
      await axios.delete(`/products/${productId}`);
      setProduct(null);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [productId]);

  // Validate product data before submission
  const validateProduct = useCallback((productData) => {
    const errors = {};

    // Required fields
    if (!productData.title) errors.title = 'Title is required';
    if (!productData.description) errors.description = 'Description is required';
    if (!productData.category_id) errors.category_id = 'Category is required';
    if (!productData.phones || !productData.phones.length) {
      errors.phones = 'At least one phone number is required';
    }

    // Price validation
    if (productData.price) {
      if (isNaN(productData.price) || productData.price < 0) {
        errors.price = 'Price must be a valid positive number';
      }
      if (!productData.currency_id) {
        errors.currency_id = 'Currency is required when price is specified';
      }
    }

    // Location validation
    if (productData.region_id && !productData.city_id) {
      errors.city_id = 'City is required when region is specified';
    }

    // Custom attributes validation
    if (productData.custom_attribute_values?.length > 0) {
      const attributeErrors = [];
      productData.custom_attribute_values.forEach((attr, index) => {
        if (attr.required && !attr.value) {
          attributeErrors[index] = `${attr.attribute_title} is required`;
        }
      });
      if (attributeErrors.length) {
        errors.custom_attribute_values = attributeErrors;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }, []);

  // Fetch product on mount
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    progress,
    updateProduct,
    deleteProduct,
    deleteImage,
    updateStatus,
    validateProduct,
    refetch: fetchProduct
  };
};

export default useEditProductQuery;