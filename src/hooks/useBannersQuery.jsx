import { useState, useEffect } from 'react';
import axios from '../config/axios_config';

/**
 * Custom hook to fetch banner data for the carousel
 * 
 * @param {Object} options - Hook options
 * @param {string} options.position - Banner position (e.g., 'main_advertising_slider', 'site_main_top')
 * @param {string} options.platform - Platform type ('web', 'mobile', 'all')
 * @param {string} options.group - Optional group identifier
 * @param {number} options.limit - Maximum number of banners to fetch
 * @returns {Object} Query result object
 */
const useBannersQuery = ({ 
  position = 'main_advertising_slider', 
  platform = 'web',
  group = null,
  limit = 10
} = {}) => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        // Build the API URL with query parameters
        const params = new URLSearchParams({
          position,
          platform,
          type: position,
          limit: limit.toString()
        });
        
        if (group) {
          params.append('group', group);
        }
        
        const response = await axios.get(`/banners?${params.toString()}`);
        const data = response.data.data || [];
        
        // Transform API data to match the expected banner format if needed
        const transformedBanners = data.map(banner => ({
          id: banner.id,
          title: banner.title || '',
          description: banner.description || '',
          buttonText: banner.properties?.buttonText || 'Подробнее',
          buttonLink: banner.link || '#',
          backgroundColor: banner.properties?.backgroundColor || 'bg-gradient-to-r from-blue-600 to-blue-400',
          textColor: banner.properties?.textColor || 'text-white',
          image: banner.image || 'https://picsum.photos/500/300?random=' + banner.id
        }));
        
        setBanners(transformedBanners);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError(err.message);
        // If API fails, we can return empty array or fallback data
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [position, platform, group, limit]);

  return { 
    banners, 
    isLoading, 
    error,
    isError: !!error,
    isEmpty: banners.length === 0 && !isLoading
  };
};

export default useBannersQuery;