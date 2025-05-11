// src/Hooks/useTaxRates.js
import { useEffect, useState } from 'react';

let cachedTaxRates = null;

export function useTaxRates() {
  const [data, setData] = useState(cachedTaxRates);
  const [loading, setLoading] = useState(!cachedTaxRates);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cachedTaxRates) {
      fetch('http://localhost:5000/api/all-single-filer-tax')
        .then(res => res.json())
        .then(json => {
          cachedTaxRates = json;
          setData(json);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load tax rates:', err);
          setError(err);
          setLoading(false);
        });
    }
  }, []);

  return { data, loading, error };
}
