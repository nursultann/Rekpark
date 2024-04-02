import { useState, useEffect } from 'react';

export const useNumberFormat = (initialValue, format = '') => {
  const [formattedValue, setFormattedValue] = useState(initialValue || '');

  useEffect(() => {
    const formatNumber = (value) => {
      // Regex for the desired format
      const regex = /(\d{3})(\d{2})(\d{2})(\d{2})/;
      const match = regex.exec(value);

      if (match) {
        setFormattedValue(`${match[1]} ${match[2]} ${match[3]} ${match[4]}`);
      } else {
        setFormattedValue(value); // Handle invalid input gracefully
      }
    };

    formatNumber(initialValue); // Format on initial value

    return () => {
      // Cleanup function (optional, if needed)
    };
  }, [initialValue]); // Dependency array

  const handleChange = (event) => {
    const unformattedValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    formatNumber(unformattedValue);
  };

  return { formattedValue, handleChange };
};