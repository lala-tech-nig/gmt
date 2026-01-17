import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Input from '../components/Input';
import CameraCapture from '../components/CameraCapture';
import AnimatedButton from '../components/AnimatedButton';
import { API_BASE_URL } from '../config';

const STEPS = ['Personal Data', 'Contact Info', 'Address', 'Identity', 'Emergency'];

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', surname: '',
        nationality: 'Nigerian', hometown: '', lgaOfOrigin: '', stateOfOrigin: '',
        dob: '', religion: '', gender: '',
        phone: '', isWhatsApp: false, email: '',
        houseNumber: '', streetName: '', city: '', residenceLga: '', residenceState: '',
        pvcStatus: '', nin: '',
        imageData: null,
        emergencyName: '', emergencyRel: '', emergencyPhone: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageCapture = (dataUrl) => {
        setFormData(prev => ({ ...prev, imageData: dataUrl }));
    };

    const validateStep = (step) => {
        const newErrors = {};
        if (step === 0) {
            if (!formData.firstName) newErrors.firstName = 'First Name is required';
            if (!formData.surname) newErrors.surname = 'Surname is required';
            if (!formData.dob) newErrors.dob = 'Date of Birth is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
        }
        if (step === 1) {
            if (!formData.phone) newErrors.phone = 'Phone Number is required';
        }
        if (step === 2) {
            if (!formData.houseNumber) newErrors.houseNumber = 'House Number is required';
            if (!formData.streetName) newErrors.streetName = 'Street Name is required';
            if (!formData.city) newErrors.city = 'City is required';
            if (!formData.residenceState) newErrors.residenceState = 'State is required';
        }
        if (step === 3) {
            if (!formData.pvcStatus) newErrors.pvcStatus = 'PVC Status is required';
            if (!formData.nin) newErrors.nin = 'NIN is required';
            if (formData.nin && formData.nin.length !== 11) newErrors.nin = 'NIN must be 11 digits';
            if (!formData.imageData) newErrors.imageData = 'Image is required';
        }
        if (step === 4) {
            if (!formData.emergencyName) newErrors.emergencyName = 'Emergency Contact Name is required';
            if (!formData.emergencyRel) newErrors.emergencyRel = 'Relationship is required';
            if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency Contact Phone is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            setIsSubmitting(true);
            try {
                // Remove imageUrl from formData key collision if it existed, just use imageData
                const payload = { ...formData };
                // Ensure backend expects 'imageData' or 'imageUrl'
                // Based on previous code, backend might expect 'imageUrl' or 'imageData'
                // The backend controller for 'public/register' handles this.
                // Assuming it expects the fields directly.

                const response = await fetch(`${API_BASE_URL}/public/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    navigate('/success');
                } else {
                    throw new Error(data.message || 'Registration failed');
                }
            } catch (err) {
                console.error('Registration Error:', err);
                alert(err.message || 'Registration failed. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="registration-page" style={{
            minHeight: '100vh',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h1 className="text-center" style={{
                color: 'var(--primary-color)',
                marginBottom: '2rem',
                fontSize: '1.75rem',
                fontWeight: '700'
            }}>Citizen Registration</h1>

            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', position: 'relative' }}>
                    {STEPS.map((step, idx) => (
                        <div key={idx} style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            color: idx <= currentStep ? 'var(--primary-color)' : '#999',
                            fontWeight: idx === currentStep ? 'bold' : 'normal'
                        }}>
                            {idx + 1}
                        </div>
                    ))}
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        style={{ height: '100%', backgroundColor: 'var(--primary-color)' }}
                    />
                </div>
                <p className="text-center" style={{ marginTop: '0.5rem', color: 'var(--text-gray)', fontSize: '0.9rem' }}>
                    {STEPS[currentStep]}
                </p>
            </div>

            <motion.div
                layout
                className="card glass"
                style={{ width: '100%', maxWidth: '600px', padding: '2rem', borderRadius: '24px' }}
            >
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {currentStep === 0 && (
                                <div className="grid-responsive" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
                                    <Input label="Surname" name="surname" value={formData.surname} onChange={handleChange} error={errors.surname} required />
                                    <Input label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                                    <Input label="Gender" type="select" name="gender" value={formData.gender} onChange={handleChange} options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Other', label: 'Other' }
                                    ]} error={errors.gender} required />
                                    <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} required />
                                    <Input label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                                    <Input label="State of Origin" name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleChange} />
                                    <Input label="LGA of Origin" name="lgaOfOrigin" value={formData.lgaOfOrigin} onChange={handleChange} />
                                    <Input label="Hometown" name="hometown" value={formData.hometown} onChange={handleChange} />
                                    <Input label="Religion" type="select" name="religion" value={formData.religion} onChange={handleChange} options={[
                                        { value: 'Christianity', label: 'Christianity' },
                                        { value: 'Islam', label: 'Islam' },
                                        { value: 'Traditional', label: 'Traditional' },
                                        { value: 'Other', label: 'Other' }
                                    ]} />
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div>
                                    <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required placeholder="080..." />
                                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <input
                                            type="checkbox"
                                            name="isWhatsApp"
                                            checked={formData.isWhatsApp}
                                            onChange={handleChange}
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                                        />
                                        <label style={{ fontSize: '0.95rem' }}>This is also my WhatsApp number</label>
                                    </div>
                                    <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" />
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div>
                                    <Input label="House Number" name="houseNumber" value={formData.houseNumber} onChange={handleChange} error={errors.houseNumber} required />
                                    <Input label="Street Name" name="streetName" value={formData.streetName} onChange={handleChange} error={errors.streetName} required />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <Input label="City / Town" name="city" value={formData.city} onChange={handleChange} error={errors.city} required />
                                        <Input label="State (Residence)" name="residenceState" value={formData.residenceState} onChange={handleChange} error={errors.residenceState} required />
                                    </div>
                                    <Input label="LGA of Residence" name="residenceLga" value={formData.residenceLga} onChange={handleChange} />
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div>
                                    <Input label="Do you have a PVC?" type="select" name="pvcStatus" value={formData.pvcStatus} onChange={handleChange} options={[
                                        { value: 'YES', label: 'Yes, I have my PVC' },
                                        { value: 'NO', label: 'No, I don\'t have one' }
                                    ]} error={errors.pvcStatus} required />

                                    <Input label="NIN (11 Digits)" name="nin" value={formData.nin} onChange={handleChange} placeholder="12345678901" error={errors.nin} required />

                                    <div style={{ marginTop: '2rem' }}>
                                        <CameraCapture label="Take a Photo / Upload Image" onCapture={handleImageCapture} />
                                        {errors.imageData && <div style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{errors.imageData}</div>}
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-gray)', fontSize: '1.1rem' }}>Emergency Contact</h3>
                                    <Input label="Full Name" name="emergencyName" value={formData.emergencyName} onChange={handleChange} error={errors.emergencyName} required />
                                    <Input label="Relationship" name="emergencyRel" value={formData.emergencyRel} onChange={handleChange} placeholder="e.g. Brother, Wife" error={errors.emergencyRel} required />
                                    <Input label="Contact Number" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} error={errors.emergencyPhone} required />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                        {currentStep > 0 ? (
                            <AnimatedButton
                                onClick={handleBack}
                                className="btn"
                                style={{ backgroundColor: '#f1f5f9', color: 'var(--text-dark)' }}
                            >
                                <ChevronLeft size={18} /> Back
                            </AnimatedButton>
                        ) : <div></div>}

                        {currentStep < STEPS.length - 1 ? (
                            <AnimatedButton onClick={handleNext}>
                                Next Step <ChevronRight size={18} />
                            </AnimatedButton>
                        ) : (
                            <AnimatedButton
                                type="submit"
                                isLoading={isSubmitting}
                                onClick={handleSubmit}
                            >
                                <Check size={18} /> Submit Registration
                            </AnimatedButton>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegistrationPage;
