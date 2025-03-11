import { useState, useEffect, useCallback } from 'react';
import axios from '../config/axios_config';
import { useEffectOnce } from 'react-use';

const useRegionsQuery = (initialSelection = {}) => {
  // Main data states
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Selected values
  const [selectedRegion, setSelectedRegion] = useState(initialSelection.regionId || null);
  const [selectedCity, setSelectedCity] = useState(initialSelection.cityId || null);
  const [selectedDistrict, setSelectedDistrict] = useState(initialSelection.districtId || null);

  // Loading states
  const [loading, setLoading] = useState({
    regions: false,
    cities: false,
    districts: false
  });

  // Error states
  const [error, setError] = useState({
    regions: null,
    cities: null,
    districts: null
  });

  // Fetch all regions
  const fetchRegions = useCallback(async () => {
    setLoading(prev => ({ ...prev, regions: true }));
    setError(prev => ({ ...prev, regions: null }));

    try {
      const response = await axios.get('/regions');
      setRegions(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch regions';
      setError(prev => ({ ...prev, regions: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, regions: false }));
    }
  }, []);

  // Fetch cities for a specific region
  const fetchCities = useCallback(async (regionId) => {
    if (!regionId) {
      setCities([]);
      return;
    }

    setLoading(prev => ({ ...prev, cities: true }));
    setError(prev => ({ ...prev, cities: null }));

    try {
      const response = await axios.get('/cities', {
        params: { 
            search: `region_id:${regionId}`,
            searchFields: 'region_id:='
        }
      });
      setCities(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch cities';
      setError(prev => ({ ...prev, cities: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, cities: false }));
    }
  }, []);

  // Fetch districts for a specific city
  const fetchDistricts = useCallback(async (cityId) => {
    if (!cityId) {
      setDistricts([]);
      return;
    }

    setLoading(prev => ({ ...prev, districts: true }));
    setError(prev => ({ ...prev, districts: null }));

    try {
      const response = await axios.get('/districts', {
        params: { city_id: cityId }
      });
      setDistricts(response.data.data);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch districts';
      setError(prev => ({ ...prev, districts: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  }, []);

  // Handle region selection
  const selectRegion = useCallback(async (regionId) => {
    setSelectedRegion(regionId);
    setSelectedCity(null);
    setSelectedDistrict(null);
    
    if (regionId) {
      await fetchCities(regionId);
    } else {
      setCities([]);
      setDistricts([]);
    }
  }, [fetchCities]);

  // Handle city selection
  const selectCity = useCallback(async (cityId) => {
    setSelectedCity(cityId);
    setSelectedDistrict(null);
    
    if (cityId) {
      await fetchDistricts(cityId);
    } else {
      setDistricts([]);
    }
  }, [fetchDistricts]);

  // Handle district selection
  const selectDistrict = useCallback((districtId) => {
    setSelectedDistrict(districtId);
  }, []);

  // Get current selections with full data
  const getSelectedLocations = useCallback(() => {
    const selectedRegionData = regions.find(r => r.id === selectedRegion);
    const selectedCityData = cities.find(c => c.id === selectedCity);
    const selectedDistrictData = districts.find(d => d.id === selectedDistrict);

    return {
      region: selectedRegionData || null,
      city: selectedCityData || null,
      district: selectedDistrictData || null
    };
  }, [regions, cities, districts, selectedRegion, selectedCity, selectedDistrict]);

  // Reset selections
  const resetSelections = useCallback(() => {
    setSelectedRegion(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setCities([]);
    setDistricts([]);
  }, []);



    // Fetch regions on component mount
    useEffectOnce(() => {
        fetchRegions();
    });

  return {
    // Data
    regions,
    cities,
    districts,
    
    // Selected values
    selectedRegion,
    selectedCity,
    selectedDistrict,
    
    // Loading states
    loading,
    
    // Error states
    error,
    
    // Actions
    selectRegion,
    selectCity,
    selectDistrict,
    resetSelections,
    
    // Helpers
    getSelectedLocations,
    
    // Fetch functions
    fetchRegions,
    fetchCities,
    fetchDistricts
  };
};

export default useRegionsQuery;