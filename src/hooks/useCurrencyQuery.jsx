import { useState, useEffect, useCallback } from 'react';
import axios from '../config/axios_config';

const useCurrencyQuery = (initialCurrencyId = null) => {
  // Main data state
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrencyId);
  const [defaultCurrency, setDefaultCurrency] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all currencies
  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/currencies');
      const currenciesData = response.data.data;
      
      setCurrencies(currenciesData);
      
      // Find default currency
      const defaultCurr = currenciesData.find(c => c.is_default) || 
                          (currenciesData.length > 0 ? currenciesData[0] : null);
      
      if (defaultCurr) {
        setDefaultCurrency(defaultCurr);
        
        // If no currency is selected yet, select the default
        if (!selectedCurrency) {
          setSelectedCurrency(defaultCurr.id);
        }
      }
      
      return currenciesData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch currencies';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedCurrency]);

  // Select a currency by ID
  const selectCurrency = useCallback((currencyId) => {
    setSelectedCurrency(currencyId);
  }, []);

  // Get currency data by ID
  const getCurrencyById = useCallback((currencyId) => {
    return currencies.find(currency => currency.id === currencyId) || null;
  }, [currencies]);

  // Get currently selected currency
  const getSelectedCurrency = useCallback(() => {
    return getCurrencyById(selectedCurrency) || defaultCurrency;
  }, [selectedCurrency, defaultCurrency, getCurrencyById]);

  // Format price with currency symbol
  const formatPrice = useCallback((price, currencyId = null) => {
    if (price === null || price === undefined) return '';
    
    const targetCurrency = currencyId 
      ? getCurrencyById(currencyId) 
      : getSelectedCurrency();
    
    if (!targetCurrency) return `${price}`;
    
    // Format with currency symbol based on settings (could be fetched from API)
    const currencySymbolPosition = 'after'; // or 'before' based on user settings
    
    if (currencySymbolPosition === 'before') {
      return `${targetCurrency.symbol}${price}`;
    } else {
      return `${price} ${targetCurrency.symbol}`;
    }
  }, [getCurrencyById, getSelectedCurrency]);

  // Convert price between currencies
  const convertPrice = useCallback((price, fromCurrencyId, toCurrencyId) => {
    // This would require exchange rates to be available in the API
    // For now we'll just return the original price with a note
    console.warn('Currency conversion not implemented, requires exchange rates');
    return price;
  }, []);

  // Load currencies on mount
  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies,
    selectedCurrency,
    defaultCurrency,
    loading,
    error,
    fetchCurrencies,
    selectCurrency,
    getSelectedCurrency,
    getCurrencyById,
    formatPrice,
    convertPrice
  };
};

export default useCurrencyQuery;