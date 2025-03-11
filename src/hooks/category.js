import { useState, useEffect, useCallback } from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as api from "../api";
import {setCategories} from "../redux/actions/category_actions";
import {useEffectOnce} from "react-use";
import axios from '../config/axios_config';

export function useCategoriesTree() {
    const dispatch = useDispatch();
    const {categories} = useSelector((state) => state.category);

    const fetchCategoriesTree = async () => {
        const categories = await api.fetchCategoriesTree();
        if (categories != null) {
            dispatch(setCategories(categories));
        }
    };
    useEffectOnce(() => {
        fetchCategoriesTree().then();
    })
    return categories;
}

export const useCategoriesQuery = (initialOptions = {}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options] = useState({
    includeTree: true,
    includeSearchFields: true,
    loadOnMount: true,
    ...initialOptions
  });

  // Fetch category tree
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/categories/tree');
      setCategories(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single category with details
  const fetchCategoryDetails = useCallback(async (categoryId) => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        parents: true
      };

      const response = await axios.get(`/api/categories/${categoryId}`, { params });
      setSelectedCategory(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch category details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get search fields for a category
  const getSearchFields = useCallback((category) => {
    if (!category) return [];

    // Combine category's own search fields with parent category fields if any
    let searchFields = [...(category.search_fields || [])];
    
    if (category.parent_id && category.category_tree) {
      category.category_tree.forEach(parent => {
        if (parent.search_fields) {
          searchFields = [...searchFields, ...parent.search_fields];
        }
      });
    }

    return searchFields;
  }, []);

  // Get custom attributes for a category
  const getCategoryAttributes = useCallback((category) => {
    if (!category) return [];
    return category.custom_attribute || [];
  }, []);

  // Find category by ID in tree
  const findCategoryInTree = useCallback((categoryId, categoriesTree = categories) => {
    for (const category of categoriesTree) {
      if (category.id === categoryId) {
        return category;
      }
      if (category.children?.length) {
        const found = findCategoryInTree(categoryId, category.children);
        if (found) return found;
      }
    }
    return null;
  }, [categories]);

  // Get breadcrumb path for category
  const getCategoryPath = useCallback((category) => {
    if (!category) return [];
    
    const path = [];
    let current = category;
    
    while (current) {
      path.unshift({
        id: current.id,
        name: current.name
      });
      current = findCategoryInTree(current.parent_id);
    }
    
    return path;
  }, [findCategoryInTree]);

  // Select a category and load its details
  const selectCategory = useCallback(async (categoryId) => {
    const details = await fetchCategoryDetails(categoryId);
    if (details) {
      return {
        ...details,
        searchFields: getSearchFields(details),
        attributes: getCategoryAttributes(details),
        path: getCategoryPath(details)
      };
    }
    return null;
  }, [fetchCategoryDetails, getSearchFields, getCategoryAttributes, getCategoryPath]);

  // Initial load
  useEffect(() => {
    if (options.loadOnMount) {
      fetchCategories();
    }
  }, [options.loadOnMount, fetchCategories]);

  return {
    categories,
    selectedCategory,
    loading,
    error,
    fetchCategories,
    selectCategory,
    getSearchFields,
    getCategoryAttributes,
    getCategoryPath,
    findCategoryInTree
  };
};