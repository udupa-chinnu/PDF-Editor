import React, { useState } from 'react';
import './uploadForm.css'

const UploadForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: new FormData(event.target),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Your PDF</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pdfFile">Select PDF:</label>
        <input type="file" id="pdfFile" name="pdfFile" accept=".pdf" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadForm;
