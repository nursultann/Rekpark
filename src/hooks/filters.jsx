import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from 'react-use';

const useSearchFilters = (initialFilters = {}, onFiltersChange) => {
  const [filters, setFilters] = useState({
    // Basic filters
    searchText: '',
    categories: '',
    status: 'active',
    
    // Media filters
    has_photo: false,
    has_video: false,
    
    // Price filters
    price_from: null,
    price_to: null,
    currency_id: null,
    
    // Location filters
    region_id: null,
    city_id: null,
    district_id: null,
    
    // Sort options
    sort: '',
    
    // Custom filters
    filter_attributes: {},
    car_attributes: {},
    
    // Override with initial filters
    ...initialFilters
  });

  // Store previous values for location cascading
  const [previousValues, setPreviousValues] = useState({
    region_id: null,
    city_id: null
  });

  // Debounce certain filter changes
  const [debouncedSearchText] = useDebounce(filters.searchText, 300);
  const [debouncedPriceFrom] = useDebounce(filters.price_from, 500);
  const [debouncedPriceTo] = useDebounce(filters.price_to, 500);

  // Update filters with type checking and validation
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      Object.entries(newFilters).forEach(([key, value]) => {
        switch (key) {
          case 'price_from':
          case 'price_to':
            updatedFilters[key] = value === '' ? null : Number(value);
            break;
            
          case 'region_id':
            updatedFilters[key] = value;
            // Clear city and district when region changes
            if (value !== prevFilters.region_id) {
              updatedFilters.city_id = null;
              updatedFilters.district_id = null;
            }
            break;
            
          case 'city_id':
            updatedFilters[key] = value;
            // Clear district when city changes
            if (value !== prevFilters.city_id) {
              updatedFilters.district_id = null;
            }
            break;
            
          case 'filter_attributes':
            updatedFilters[key] = {
              ...prevFilters.filter_attributes,
              ...value
            };
            break;
            
          case 'car_attributes':
            updatedFilters[key] = {
              ...prevFilters.car_attributes,
              ...value
            };
            break;
            
          default:
            updatedFilters[key] = value;
        }
      });
      
      return updatedFilters;
    });
  }, []);

  // Handle custom attribute update
  const updateCustomAttribute = useCallback((attributeName, value) => {
    updateFilters({
      filter_attributes: {
        [attributeName]: value
      }
    });
  }, [updateFilters]);

  // Handle car attribute update
  const updateCarAttribute = useCallback((attributeName, value) => {
    updateFilters({
      car_attributes: {
        [attributeName]: value
      }
    });
  }, [updateFilters]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Reset specific filter group
  const resetFilterGroup = useCallback((group) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      switch (group) {
        case 'price':
          updatedFilters.price_from = null;
          updatedFilters.price_to = null;
          updatedFilters.currency_id = null;
          break;
          
        case 'location':
          updatedFilters.region_id = null;
          updatedFilters.city_id = null;
          updatedFilters.district_id = null;
          break;
          
        case 'custom':
          updatedFilters.filter_attributes = {};
          break;
          
        case 'car':
          updatedFilters.car_attributes = {};
          break;
          
        default:
          break;
      }
      
      return updatedFilters;
    });
  }, []);

  // Get active filters count
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    
    if (filters.searchText) count++;
    if (filters.categories) count++;
    if (filters.has_photo) count++;
    if (filters.has_video) count++;
    if (filters.price_from || filters.price_to) count++;
    if (filters.region_id) count++;
    if (filters.city_id) count++;
    if (filters.district_id) count++;
    if (Object.keys(filters.filter_attributes).length) count += Object.keys(filters.filter_attributes).length;
    if (Object.keys(filters.car_attributes).length) count += Object.keys(filters.car_attributes).length;
    
    return count;
  }, [filters]);

  // Trigger callback when debounced values change
  useEffect(() => {
    const updatedFilters = {
      ...filters,
      searchText: debouncedSearchText,
      price_from: debouncedPriceFrom,
      price_to: debouncedPriceTo
    };
    
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    }
  }, [
    debouncedSearchText,
    debouncedPriceFrom,
    debouncedPriceTo,
    filters,
    onFiltersChange
  ]);

  return {
    filters,
    updateFilters,
    updateCustomAttribute,
    updateCarAttribute,
    resetFilters,
    resetFilterGroup,
    getActiveFiltersCount
  };
};

export default useSearchFilters;