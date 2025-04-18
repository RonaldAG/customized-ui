"use client";

import { useState, useEffect } from 'react';

export default function Product() {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedForm, setSelectedForm] = useState('');

  async function fetchForms() {
    try {
      setLoading(true);
      setError(null);
      // TODO: read it from a env file
      const response = await fetch("http://localhost:9090");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.forms);
      setForms(data.forms);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching forms:', error);
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
      fetchForms();
    } catch (error) {
      setError(error.message);
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <div>
            <input
              type="file"
              onChange={handleFileChange}
            />
            <button 
              onClick={handleFileUpload}
            >
              Upload File
            </button>
          </div>
          <div>
            <form>
              <select value={selectedForm} onChange={e => setSelectedForm(e.target.value)}>
                <option></option>
                {forms.map((form, index) => (
                  <option key={index} value={index}>{form.formName}</option>
                ))}
              </select>
            </form>
            <form> {
                selectedForm != '' ?
                forms[selectedForm].attributes.map((attribute, index) => (
                  <label key={index}>
                    {attribute.name}:<input name={attribute.name} type={attribute.type == 'string' ? "text" : "checkbox"}/> 
                  </label>
                )) : <p></p>
              }
            </form>
          </div>
        </>
      )}
    </div>
  );
}


