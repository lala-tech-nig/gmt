import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Users, Phone, BarChart, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
    // TODO: Check for auth/role in real implementation

    return (
        <div className="admin-dashboard">
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Admin Dashboard</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <DashboardCard
                    to="/admin/upload"
                    icon={<Upload size={32} />}
                    title="NIN Bulk Upload"
                    desc="Sort and classify bulk NIN records."
                />
                <DashboardCard
                    to="/admin/registrations"
                    icon={<UserCheck size={32} />}
                    title="Online Registrations"
                    desc="View citizens registered via portal."
                />
                <DashboardCard
                    to="/admin/nins"
                    icon={<Users size={32} />}
                    title="NIN Viewer"
                    desc="Read-only view of bulk NIN records."
                />
                <DashboardCard
                    to="/admin/non-pvc"
                    icon={<Phone size={32} />}
                    title="Engagement"
                    desc="Manage contacts for citizens without PVC."
                />
                <DashboardCard
                    to="/board/dashboard"
                    icon={<BarChart size={32} />}
                    title="Board Overview"
                    desc="Aggregated reports and statistics."
                />
            </div>
        </div>
    );
};

const DashboardCard = ({ to, icon, title, desc }) => (
    <Link to={to} className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s'
    }}>
        <div style={{
            color: 'var(--primary-color)',
            marginBottom: '1rem',
            backgroundColor: 'rgba(0, 135, 83, 0.1)',
            padding: '1rem',
            borderRadius: '50%'
        }}>
            {icon}
        </div>
        <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{desc}</p>
    </Link>
);

export default AdminDashboard;
