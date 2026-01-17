import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
    return (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <CheckCircle size={80} color="var(--success)" />
                </div>

                <h1 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Registration Successful!</h1>

                <p style={{ maxWidth: '500px', margin: '0 auto 2rem', color: 'var(--text-light)', fontSize: '1.1rem' }}>
                    Thank you for registering your details. Your information has been securely received and recorded.
                </p>

                <Link to="/" className="btn btn-primary">
                    Return to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default SuccessPage;
