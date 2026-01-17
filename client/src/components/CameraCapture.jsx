import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

const CameraCapture = ({ onCapture, label }) => {
    const fileInputRef = useRef(null);
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                onCapture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImage(null);
        onCapture(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerCamera = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-dark)' }}>
                {label}
            </label>

            {image ? (
                <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#f0f0f0', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
                    <img src={image} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    <button
                        type="button"
                        onClick={clearImage}
                        style={{
                            position: 'absolute', top: '10px', right: '10px',
                            backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                            borderRadius: '50%', padding: '8px', border: 'none', cursor: 'pointer'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div style={{ border: '2px dashed #ccc', borderRadius: 'var(--border-radius)', padding: '2rem', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <Camera size={48} color="var(--primary-color)" />
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Tap below to take a photo or upload</p>

                        <button type="button" onClick={triggerCamera} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Camera size={20} /> Take Photo
                        </button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            capture="environment" // Forces rear camera on mobile
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
