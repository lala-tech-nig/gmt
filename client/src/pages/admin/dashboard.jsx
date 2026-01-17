import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Users, Phone, BarChart, UserCheck, Shield, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
    // TODO: Fetch real stats here if needed, or keeping it static for menu
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        pendingVerifications: 0
    });

    return (
        <div className="admin-dashboard" style={{ paddingBottom: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2.5rem'
                }}
            >
                <div>
                    <h1 style={{
                        color: 'var(--text-dark)',
                        fontSize: '2rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem'
                    }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-gray)' }}>Welcome back, Administrator.</p>
                </div>
                <div style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-color)',
                    borderRadius: '20px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Shield size={16} /> Admin Access
                </div>
            </motion.div>

            {/* Quick Stats Row - Placeholder for functionality expansion */}
            {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <StatCard label="Total Citizens" value="12,450" color="#008753" />
                <StatCard label="New Today" value="145" color="#10b981" />
                <StatCard label="Pending" value="28" color="#f59e0b" />
            </div> */}

            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Quick Actions</h2>

            <motion.div
                className="grid-responsive"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
            >
                <DashboardCard
                    to="/admin/registrations"
                    icon={<UserCheck size={32} />}
                    title="Online Registrations"
                    desc="Review and verify citizen submissions from the public portal."
                    color="var(--primary-color)"
                />
                <DashboardCard
                    to="/admin/upload"
                    icon={<Upload size={32} />}
                    title="Bulk Upload"
                    desc="Import large datasets of NIN records via CSV or Excel."
                    color="#0ea5e9"
                />
                <DashboardCard
                    to="/admin/nins"
                    icon={<Users size={32} />}
                    title="Citizen Database"
                    desc="Search and manage the complete citizen registry."
                    color="#8b5cf6"
                />
                <DashboardCard
                    to="/admin/non-pvc"
                    icon={<Phone size={32} />}
                    title="Engagement"
                    desc="Contact center for citizens without PVCs."
                    color="#f59e0b"
                />
                <DashboardCard
                    to="/board/dashboard"
                    icon={<BarChart size={32} />}
                    title="Analytics Board"
                    desc="View aggregated reports and system-wide statistics."
                    color="#ef4444"
                />
            </motion.div>
        </div>
    );
};

const DashboardCard = ({ to, icon, title, desc, color }) => (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <Link to={to} className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textDecoration: 'none',
            color: 'inherit',
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                color: color,
                marginBottom: '1.5rem',
                backgroundColor: `${color}15`, // 10% opacity
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.3rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', lineHeight: '1.6', flex: 1 }}>{desc}</p>

            <div style={{
                marginTop: '1.5rem',
                color: color,
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.9rem'
            }}>
                Open Module <ChevronRight size={16} />
            </div>
        </Link>
    </motion.div>
);

const StatCard = ({ label, value, color }) => (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            width: '4px', height: '40px', backgroundColor: color, borderRadius: '4px'
        }} />
        <div>
            <div style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>{value}</div>
        </div>
    </div>
);

export default AdminDashboard;
