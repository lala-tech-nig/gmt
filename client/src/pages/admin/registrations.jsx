import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { UserCheck, Search, Loader2 } from 'lucide-react';
import CitizenDetailModal from '../../components/CitizenDetailModal';
import Input from '../../components/Input';
import { API_BASE_URL } from '../../config';

const RegisteredUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRegistrations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/admin/registrations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    setUsers(data.data);
                    setFilteredUsers(data.data);
                } else {
                    console.error('Error fetching registrations:', data.message);
                }
            } catch (err) {
                console.error('Error fetching registrations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    useEffect(() => {
        const lower = searchTerm.toLowerCase();
        const filtered = users.filter(u =>
            u.surname.toLowerCase().includes(lower) ||
            u.firstName.toLowerCase().includes(lower) ||
            (u.nin && u.nin.includes(lower))
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserCheck size={24} color="var(--primary-color)" />
                        </div>
                        Online Registrations
                    </h2>
                    <p style={{ color: 'var(--text-gray)' }}>Manage citizens who have registered via the public portal.</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Search color="var(--text-light)" />
                <input
                    type="text"
                    placeholder="Search by Name or NIN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', fontSize: '1rem', width: '100%', outline: 'none' }}
                />
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-gray)' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Loader2 size={40} color="var(--primary-color)" />
                    </motion.div>
                    <p style={{ marginTop: '1rem' }}>Loading records...</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>Photo</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>Name</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>NIN (Masked)</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>Location</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>Contact</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                        whileHover={{ backgroundColor: '#f8fafc' }}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            {user.imageUrl ? (
                                                <img src={user.imageUrl} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                            ) : (
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                                    <UserCheck size={20} />
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{user.surname} {user.firstName}</div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-gray)', fontFamily: 'monospace' }}>{user.ninMasked || 'Pending'}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '0.85rem', padding: '4px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '20px' }}>
                                                {user.residenceState}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-gray)' }}>{user.phone}</td>
                                        <td style={{ padding: '16px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-gray)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                                <Search size={48} color="#e2e8f0" />
                                                <p>No registrations found matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
