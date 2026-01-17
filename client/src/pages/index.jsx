import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Shield, Users, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page" style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '80px',
            paddingBottom: '80px',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 135, 83, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(0, 135, 83, 0.05) 0%, transparent 20%)'
        }}>
            {/* Background Decor */}
            <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,135,83,0.1), rgba(212,244,221,0.3))', filter: 'blur(80px)', zIndex: -1 }} />
            <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,135,83,0.05), rgba(212,244,221,0.2))', filter: 'blur(60px)', zIndex: -1 }} />

            <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', zIndex: 10 }}>
                <Link to="/login" className="btn" style={{
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'var(--primary-color)',
                    border: '1px solid var(--primary-light)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    Admin Login
                </Link>
            </div>

            <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'var(--white)',
                        borderRadius: '30%', /* Soft square */
                        margin: '0 auto 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-glow)',
                        transform: 'rotate(-5deg)'
                    }}>
                        <ShieldCheck size={56} color="var(--primary-color)" />
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        marginBottom: '1.5rem',
                        color: 'var(--text-dark)',
                        fontWeight: '700',
                        letterSpacing: '-1px',
                        lineHeight: '1.1'
                    }}>
                        National <span className="text-primary">Civic Engagement</span> Portal
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-gray)',
                        maxWidth: '700px',
                        margin: '0 auto 3rem',
                        lineHeight: '1.8',
                        fontWeight: '300'
                    }}>
                        A secure, unified platform for citizens to register their details for civic engagement.
                        Ensuring that every citizen, regardless of status, is accounted for.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '5rem'
                    }}>
                        <Link to="/register">
                            <motion.button
                                className="btn btn-primary"
                                style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: '50px' }}
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 135, 83, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Register Your Details
                            </motion.button>
                        </Link>
                    </div>

                    <div className="grid-responsive" style={{ textAlign: 'left' }}>
                        <InfoCard
                            icon={<Shield size={32} color="var(--primary-color)" />}
                            title="Secure Data"
                            desc="Your information is encrypted using bank-grade security protocols. We prioritize your privacy and data protection above all else."
                            delay={0.2}
                        />
                        <InfoCard
                            icon={<Users size={32} color="var(--primary-color)" />}
                            title="Civic Inclusion"
                            desc="Ensuring every voice is heard. If you do not have a PVC, your registration helps us understand engagement needs."
                            delay={0.3}
                        />
                        <InfoCard
                            icon={<CheckCircle size={32} color="var(--primary-color)" />}
                            title="Verified Trust"
                            desc="Managed by the GMT Board with strict oversight and verified administrative access for data integrity."
                            delay={0.4}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="glass"
        style={{
            padding: '2.5rem',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)'
        }}
        whileHover={{ y: -10, boxShadow: 'var(--shadow-lg)' }}
    >
        <div style={{
            width: '60px', height: '60px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem'
        }}>
            {icon}
        </div>
        <h3 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontSize: '1.4rem' }}>{title}</h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-gray)', lineHeight: '1.7' }}>{desc}</p>
    </motion.div>
);

export default LandingPage;
