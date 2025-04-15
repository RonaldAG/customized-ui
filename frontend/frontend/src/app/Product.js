"use client";

import { useState, useEffect } from 'react';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:9090/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      // Refresh the products list after successful upload
      fetchProducts();
    } catch (error) {
      setError(error.message);
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ marginRight: '10px' }}
            />
            <button 
              onClick={handleFileUpload}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Upload File
            </button>
          </div>
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


