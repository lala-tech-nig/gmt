import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import CitizenDetailModal from '../../components/CitizenDetailModal';

const RegisteredUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://gmt-b7oh.onrender.com/api/admin/registrations', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setUsers(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching registrations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    return (
        <div className="container">
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserCheck /> Online Registrations
            </h2>

            {loading ? (
                <p>Loading records...</p>
            ) : (
                <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--white)' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>Photo</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>Name</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>NIN (Masked)</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>State/LGA</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>Phone</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{ borderBottom: '1px solid #dee2e6', cursor: 'pointer' }}
                                    whileHover={{ backgroundColor: '#f1f8f4' }}
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <td style={{ padding: '16px' }}>
                                        {user.imageUrl ? (
                                            <img src={user.imageUrl} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '10px' }}>N/A</span>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500' }}>{user.surname} {user.firstName}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{user.ninMasked}</td>
                                    <td style={{ padding: '16px' }}>{user.residenceState} / {user.residenceLga}</td>
                                    <td style={{ padding: '16px' }}>{user.phone}</td>
                                    <td style={{ padding: '16px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </motion.tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                                        No online registrations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedUser && (
                <CitizenDetailModal
                    citizen={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};
export default RegisteredUsersPage;
