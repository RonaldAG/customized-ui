"use client";

import { useState, useEffect } from 'react';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      // TODO: read it from a env file
      const response = await fetch("http://localhost:9090");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.customFields);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '20px', padding: '20px' }}>
            {products.map((product, index) => (
              <div key={index} >
                {Object.entries(product).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize' }}>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


