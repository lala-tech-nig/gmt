import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Check } from 'lucide-react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('csvFile', file);
    
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/upload-nins', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setMessage('Upload successful! Processing queued.');
        setFile(null);
      }
    } catch (err) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>NIN Data Upload</h2>
      
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Upload size={48} color="var(--primary-color)" />
        </div>
        
        <p style={{ marginBottom: '2rem' }}>
          Select a CSV file containing NIN records to upload and process.
        </p>

        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          id="csv-upload" 
        />
        
        <label htmlFor="csv-upload" className="btn" style={{ border: '2px dashed #ccc', display: 'block', marginBottom: '1rem', padding: '2rem', cursor: 'pointer' }}>
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FileText /> {file.name}
            </div>
          ) : (
            'Click to Select CSV File'
          )}
        </label>

        <button 
          onClick={handleUpload} 
          disabled={!file || uploading} 
          className="btn btn-primary" 
          style={{ width: '100%', opacity: (!file || uploading) ? 0.6 : 1 }}
        >
          {uploading ? 'Uploading...' : 'Upload Records'}
        </button>

        {message && (
          <div style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
export default UploadPage;
