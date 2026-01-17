import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import CameraCapture from '../components/CameraCapture';

const STEPS = ['Personal Data', 'Contact Info', 'Address', 'Identity Details', 'Emergency Contact'];

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', surname: '',
        nationality: 'Nigerian', hometown: '', lgaOfOrigin: '', stateOfOrigin: '',
        dob: '', religion: '', gender: '',
        phone: '', isWhatsApp: false, email: '',
        houseNumber: '', streetName: '', city: '', residenceLga: '', residenceState: '',
        pvcStatus: '', nin: '',
        imageData: null, // Base64 image
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
            try {
                console.log('Submitting Form:', formData);

                // Prepare payload
                // We can send JSON since our backend handles base64 in 'imageData'
                // But if we had a real file object, we'd use FormData.
                // Since CameraCapture returns base64, JSON is easiest.

                const response = await axios.post('/api/public/register', formData);

                if (response.data.success) {
                    navigate('/success');
                }
            } catch (err) {
                console.error('Registration Error:', err);
                alert(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="registration-page" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="text-center" style={{ color: 'var(--primary-color)', marginBottom: '2rem' }}>Citizen Registration</h1>

            {/* Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                {STEPS.map((step, index) => (
                    <div key={index} style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: index <= currentStep ? 'var(--primary-color)' : '#e0e0e0',
                        margin: '0 4px',
                        borderRadius: '2px'
                    }} />
                ))}
            </div>
            <p className="text-center" style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
            </p>

            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="card"
            >
                <form onSubmit={handleSubmit}>
                    {currentStep === 0 && (
                        <>
                            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
                            <Input label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                            <Input label="Surname" name="surname" value={formData.surname} onChange={handleChange} error={errors.surname} required />
                            <Input label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                            <Input label="Hometown" name="hometown" value={formData.hometown} onChange={handleChange} />
                            <Input label="LGA of Origin" name="lgaOfOrigin" value={formData.lgaOfOrigin} onChange={handleChange} />
                            <Input label="State of Origin" name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleChange} />
                            <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} required />
                            <Input label="Religion" type="select" name="religion" value={formData.religion} onChange={handleChange} options={[
                                { value: 'Christianity', label: 'Christianity' },
                                { value: 'Islam', label: 'Islam' },
                                { value: 'Traditional', label: 'Traditional' },
                                { value: 'Other', label: 'Other' }
                            ]} />
                            <Input label="Gender" type="select" name="gender" value={formData.gender} onChange={handleChange} options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' }
                            ]} error={errors.gender} required />
                        </>
                    )}

                    {currentStep === 1 && (
                        <>
                            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required />
                            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" name="isWhatsApp" checked={formData.isWhatsApp} onChange={handleChange} />
                                <label>This is also my WhatsApp number</label>
                            </div>
                            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <Input label="House Number" name="houseNumber" value={formData.houseNumber} onChange={handleChange} error={errors.houseNumber} required />
                            <Input label="Street Name" name="streetName" value={formData.streetName} onChange={handleChange} error={errors.streetName} required />
                            <Input label="City / Town" name="city" value={formData.city} onChange={handleChange} error={errors.city} required />
                            <Input label="LGA of Residence" name="residenceLga" value={formData.residenceLga} onChange={handleChange} />
                            <Input label="State" name="residenceState" value={formData.residenceState} onChange={handleChange} error={errors.residenceState} required />
                        </>
                    )}

                    {currentStep === 3 && (
                        <>
                            <Input label="Do you have a PVC?" type="select" name="pvcStatus" value={formData.pvcStatus} onChange={handleChange} options={[
                                { value: 'YES', label: 'Yes' },
                                { value: 'NO', label: 'No' }
                            ]} error={errors.pvcStatus} required />

                            <Input label="NIN (11 Digits)" name="nin" value={formData.nin} onChange={handleChange} placeholder="___________" error={errors.nin} required />

                            <CameraCapture label="Take a Photo / Upload Image" onCapture={handleImageCapture} />
                            {errors.imageData && <div style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{errors.imageData}</div>}
                        </>
                    )}

                    {currentStep === 4 && (
                        <>
                            <Input label="Emergency Contact Name" name="emergencyName" value={formData.emergencyName} onChange={handleChange} />
                            <Input label="Relationship" name="emergencyRel" value={formData.emergencyRel} onChange={handleChange} />
                            <Input label="Contact Number" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} />
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        {currentStep > 0 && (
                            <button type="button" onClick={handleBack} className="btn" style={{ backgroundColor: '#e0e0e0' }}>
                                Back
                            </button>
                        )}
                        {currentStep < STEPS.length - 1 ? (
                            <button type="button" onClick={handleNext} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                                Next Step
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                                Submit Registration
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegistrationPage;
