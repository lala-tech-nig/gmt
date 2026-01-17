import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

const CameraCapture = ({ onCapture, label }) => {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);

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

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setIsCameraOpen(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please upload an image instead.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            // Set canvas dimensions to match video
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);

            const dataUrl = canvasRef.current.toDataURL('image/png');
            setImage(dataUrl);
            onCapture(dataUrl);
            stopCamera();
        }
    };

    const clearImage = () => {
        setImage(null);
        onCapture(null);
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-dark)' }}>
                {label}
            </label>

            {/* Preview Area */}
            {image ? (
                <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#f0f0f0', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
                    <img src={image} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                        type="button"
                        onClick={clearImage}
                        style={{
                            position: 'absolute', top: '10px', right: '10px',
                            backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                            borderRadius: '50%', padding: '8px'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div style={{ border: '2px dashed #ccc', borderRadius: 'var(--border-radius)', padding: '2rem', textAlign: 'center' }}>

                    {!isCameraOpen ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <Camera size={48} color="var(--text-light)" />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={startCamera} className="btn btn-primary">
                                    Use Camera
                                </button>
                                <button type="button" onClick={() => fileInputRef.current.click()} className="btn" style={{ border: '1px solid #ccc' }}>
                                    <Upload size={18} style={{ marginRight: '8px' }} /> Upload File
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: 'var(--border-radius)' }} />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                <button type="button" onClick={capturePhoto} className="btn btn-primary">Capture</button>
                                <button type="button" onClick={stopCamera} className="btn" style={{ backgroundColor: '#dc3545', color: '#fff' }}>Cancel</button>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default CameraCapture;
