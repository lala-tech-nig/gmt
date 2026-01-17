import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Phone, Mail, Calendar } from 'lucide-react';

const CitizenDetailModal = ({ citizen, onClose }) => {
    if (!citizen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
            }} onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            backgroundColor: '#e6f4ea', color: 'var(--primary-color)',
                            borderRadius: '50%', margin: '0 auto 1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {citizen.imageUrl ? (
                                <img src={citizen.imageUrl} alt="Citizen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>
                            {citizen.firstName} {citizen.lastName}
                        </h2>
                        <p style={{ color: '#666' }}>NIN: {citizen.ninMasked || '***********'}</p>
                        <span style={{
                            display: 'inline-block',
                            marginTop: '0.5rem',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            backgroundColor: citizen.pvcStatus === 'YES' ? '#d4edda' : '#f8d7da',
                            color: citizen.pvcStatus === 'YES' ? '#155724' : '#721c24',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            PVC Status: {citizen.pvcStatus}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <DetailItem icon={<User size={18} />} label="Gender" value={citizen.gender} />
                        <DetailItem icon={<Calendar size={18} />} label="Date of Birth" value={citizen.dateOfBirth ? new Date(citizen.dateOfBirth).toLocaleDateString() : 'N/A'} />
                        <DetailItem icon={<Phone size={18} />} label="Phone" value={citizen.phone || 'N/A'} />
                        <DetailItem icon={<Mail size={18} />} label="Email" value={citizen.email || 'N/A'} />
                        <DetailItem icon={<MapPin size={18} />} label="State" value={citizen.state || citizen.residenceState} />
                        <DetailItem icon={<MapPin size={18} />} label="LGA" value={citizen.lga || citizen.residenceLga} />
                        <DetailItem icon={<MapPin size={18} />} label="Ward" value={citizen.ward || 'N/A'} />
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                        <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Address</h4>
                        <p style={{ color: '#666', lineHeight: '1.5' }}>{citizen.address || 'No address provided'}</p>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const DetailItem = ({ icon, label, value }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#888', fontSize: '0.9rem' }}>
            {icon} {label}
        </div>
        <div style={{ color: '#333', fontWeight: '500' }}>{value || 'N/A'}</div>
    </div>
);

export default CitizenDetailModal;
