import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import { Lock } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            if (res.data.success) {
                // Save token and user info
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                // Redirect based on role (simple logic for now)
                if (res.data.user.role === 'board') {
                    navigate('/board/dashboard');
                } else {
                    navigate('/admin/dashboard'); // General landing
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
            <div style={{
                width: '60px', height: '60px',
                backgroundColor: '#eee', borderRadius: '50%',
                margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Lock color="var(--primary-color)" />
            </div>

            <h1 style={{ marginBottom: '2rem', color: 'var(--text-dark)' }}>Admin Portal</h1>

            <div className="card">
                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
