import React, { useState } from 'react';

import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import AnimatedButton from '../../components/AnimatedButton';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  // ... (keep state variables same)

  // ... (keep helper functions same)

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('csvFile', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/upload-nins`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
          // Content-Type is intentionally omitted so fetch sets it to multipart/form-data with boundary
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('success:Upload successful! Records have been queued for processing.');
        setFile(null);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      setMessage('error:' + (err.message || 'Upload failed. Please check your connection and try again.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ textAlign: 'center', padding: '3rem' }}
      >
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Upload size={40} color="#0284c7" />
          </div>
        </div>

        <h2 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Bulk NIN Upload</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: '2.5rem' }}>
          Select a CSV file containing NIN records to import into the centralized database.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="csv-upload"
        />

        <label
          htmlFor="csv-upload"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? 'var(--primary-color)' : '#cbd5e1'}`,
            backgroundColor: dragActive ? 'var(--primary-light)' : '#f8fafc',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            padding: '3rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minHeight: '200px'
          }}
        >
          {file ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <FileText size={48} color="var(--primary-color)" />
              <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{file.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{(file.size / 1024).toFixed(2)} KB</div>
            </motion.div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', color: '#94a3b8' }}>
                <Upload size={32} />
              </div>
              <div style={{ fontWeight: '500', color: 'var(--text-dark)' }}>Click to select or drag file here</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Supported formats: .CSV</div>
            </>
          )}
        </label>

        <AnimatedButton
          onClick={handleUpload}
          isLoading={uploading}
          disabled={!file}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Upload size={20} /> Upload Records
        </AnimatedButton>

        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              marginTop: '1.5rem',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: message.startsWith('success') ? '#dcfce7' : '#fee2e2',
              color: message.startsWith('success') ? '#166534' : '#991b1b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            {message.startsWith('success') ? <Check size={18} /> : <AlertCircle size={18} />}
            {message.split(':')[1]}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
export default UploadPage;
