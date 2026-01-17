import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Users, CheckCircle, XCircle } from 'lucide-react';

const BoardDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="container">Loading...</div>;
    if (!stats) return <div className="container">Error loading stats</div>;

    return (
        <div className="container">
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>GMT Board Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Registrations" value={stats.totalRegistrations} icon={<Users />} color="#008753" />
                <StatCard title="PVC Holders" value={stats.totalPVC} icon={<CheckCircle />} color="#28a745" />
                <StatCard title="Non-PVC Citizens" value={stats.totalNonPVC} icon={<XCircle />} color="#dc3545" />
                <StatCard title="Bulk NINs" value={stats.totalNINs} icon={<BarChart />} color="#6c757d" />
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>New Registrations (Last 24h)</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.newToday}</p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: `4px solid ${color}` }}>
        <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: `${color}20`, color: color }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem' }}>{value.toLocaleString()}</h3>
        </div>
    </div>
);
export default BoardDashboardPage;
