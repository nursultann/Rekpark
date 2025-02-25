import { useState, useCallback, useEffect } from "react";
import { useEffectOnce } from "react-use";
import { fetchProduct, userDetails, fetchProducts as apiFetchProducts } from "../api";
import { fetchSearchProducts } from "../api/product";
import { useQuery } from 'react-query';
import axios from '../config/axios_config';

const useProductDetailsQuery = (productId) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);

    useEffectOnce(() => {
        const queryProduct = async () => {
            setIsLoading(true);
            const response = await fetchProduct(productId, {
                'with': 'category;customAttributeValues.customAttribute;region;city;user',
                'category_parents_tree': true,
            })

            if (response != null) {
                setProduct(response);
            }

            setIsLoading(false);
        }

        queryProduct();
    });

    return { product: product, isLoading: isLoading, error: error };
};

const useProductsPaginatedQuery = ({ limit = 20, searchText } = {}) => {
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);

    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        if (loading) return;
        setLoading(true);

        let results = products.concat(await apiFetchProducts({
            offset: offset, 'with': 'user;region;city',
            ...(searchText && { searchText: searchText })
        }));

        if (results != null) {
            setProducts(results);
            setOffset(offset + limit);
            if (results.length < limit) {
                setReachEnd(true);
            }
        }
        
        setLoading(false);
    };

    const reset = () => {
        setProducts([]);
        setOffset(0);
        setReachEnd(false);
    };

    useEffectOnce(() => {
        fetchProducts();
    });

    return { products: products, fetchProducts: fetchProducts, reachEnd: reachEnd, isLoading: loading, reset: reset };
}

const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    perPage: 15
  });
  const [filters, setFilters] = useState({
    categories: '', // Comma-separated category IDs
    searchText: '', // Search query for title and description
    status: 'active', // Product status (active, inactive, moderation, disabled, rejected)
    has_photo: false, // Filter products with photos
    has_video: false, // Filter products with videos
    sort: '', // Sort options: popular, newest, oldest, price-low-high, price-high-low
    filter_attributes: {}, // Custom attribute filters
    car_attributes: {}, // Car-specific attributes
    price_from: null,
    price_to: null,
    currency_id: null,
    region_id: null,
    city_id: null,
    ...initialFilters
  });

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = {
        page,
        limit: pagination.perPage,
        ...filters,
        filter_attributes: filters.filter_attributes && Object.keys(filters.filter_attributes).length > 0 
          ? JSON.stringify(filters.filter_attributes)
          : undefined,
        car_attributes: filters.car_attributes && Object.keys(filters.car_attributes).length > 0
          ? JSON.stringify(filters.car_attributes)
          : undefined
      };

      // Remove undefined/null values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key];
        }
      });

      const response = await axios.get('/products-list', { params });

      setProducts(response.data.data);
      setPagination({
        ...pagination,
        currentPage: page,
        total: response.data.meta?.total || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.perPage]);

  // Update filters and refetch products
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    fetchProducts(page);
  }, [fetchProducts]);

  // Reset filters to initial state
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1);
  }, [filters, fetchProducts]);

  return {
    products,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    handlePageChange,
    resetFilters,
    refetch: fetchProducts
  };
};

export { useProductDetailsQuery, useProductsPaginatedQuery, useProducts }
