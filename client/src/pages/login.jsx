import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import Input from '../components/Input';
import AnimatedButton from '../components/AnimatedButton';
import { Lock, LogIn, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (data.user.role === 'board') {
                    navigate('/board/dashboard');
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 135, 83, 0.05) 0%, transparent 50%)'
        }}>
            {/* Back to Home */}
            <Link to="/" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-gray)', fontWeight: '500' }}>
                <ArrowLeft size={18} /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card glass"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '3rem',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '70px', height: '70px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-color)',
                        borderRadius: '24px',
                        margin: '0 auto 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0, 135, 83, 0.15)'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h1 style={{ color: 'var(--text-dark)', fontSize: '1.75rem', fontWeight: '700' }}>Admin Portal</h1>
                    <p style={{ color: 'var(--text-gray)', marginTop: '0.5rem' }}>Secure access for authorized personnel</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                            backgroundColor: 'var(--error-bg)',
                            color: 'var(--error)',
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            fontWeight: '500'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="admin@example.com"
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                    />

                    <div style={{ marginTop: '2rem' }}>
                        <AnimatedButton
                            type="submit"
                            isLoading={isLoading}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            <LogIn size={20} /> Login Attempt
                        </AnimatedButton>
                    </div>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Protected by reCAPTCHA and Subject to the Privacy Policy and Terms of Service.
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
