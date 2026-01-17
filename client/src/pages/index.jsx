import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="landing-page" style={{ padding: '4rem 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '2rem' }}>
                <Link to="/login" className="btn" style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    backgroundColor: 'rgba(0, 135, 83, 0.1)',
                    color: 'var(--primary-color)',
                    border: '1px solid var(--primary-color)'
                }}>
                    Admin Login
                </Link>
            </div>
            <div className="container" style={{ textAlign: 'center' }}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '50%',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Simple Coat of Arms or Shield Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                        National Civic Engagement Portal
                    </h1>

                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--text-light)',
                        maxWidth: '700px',
                        margin: '0 auto 2.5rem',
                        lineHeight: '1.8'
                    }}>
                        A secure, unified platform for citizens to register their details for civic engagement and support.
                        This initiative ensures that every citizen, regardless of PVC status, is accounted for.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '3rem'
                    }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                                Register Your Details
                            </Link>
                        </motion.div>
                    </div>

                    <div style={{
                        borderTop: '1px solid #eee',
                        paddingTop: '3rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                        textAlign: 'left'
                    }}>
                        <InfoCard
                            title="Secure Data"
                            desc="Your information is encrypted and securely stored. We prioritize your privacy and data protection."
                            delay={0.2}
                        />
                        <InfoCard
                            title="Civic Inclusion"
                            desc="Ensuring every voice is heard. If you do not have a PVC, your registration helps us understand engagement needs."
                            delay={0.3}
                        />
                        <InfoCard
                            title="Institutional Trust"
                            desc="Managed by the GMT Board with strict oversight and verified administrative access."
                            delay={0.4}
                        />
                    </div>

                    <div style={{ marginTop: '4rem', opacity: 0.7 }}>
                        <Link to="/login" style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'underline' }}>
                            Authorized Officer Login
                        </Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

const InfoCard = ({ title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        style={{
            padding: '1.5rem',
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid #eaeaea'
        }}
    >
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-light)' }}>{desc}</p>
    </motion.div>
);

export default LandingPage;
