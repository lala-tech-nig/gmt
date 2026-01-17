import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Users, Search, Filter, Loader2 } from 'lucide-react';
import CitizenDetailModal from '../../components/CitizenDetailModal';
import { API_BASE_URL } from '../../config';

const NINViewerPage = () => {
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, YES, NO
    const [selectedCitizen, setSelectedCitizen] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCitizens = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const params = {};
                if (filter !== 'ALL') params.pvcStatus = filter;

                const queryParams = new URLSearchParams(params).toString();
                const response = await fetch(`${API_BASE_URL}/admin/citizens?${queryParams}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    setCitizens(data.data);
                } else {
                    console.error('Error fetching citizens:', data.message);
                }
            } catch (err) {
                console.error('Error fetching citizens:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCitizens();
    }, [filter]);

    const filteredCitizens = citizens.filter(c => {
        const term = searchTerm.toLowerCase();
        const fullName = `${c.firstName} ${c.lastName || c.surname}`.toLowerCase();
        const nin = (c.ninMasked || '').toLowerCase();
        return fullName.includes(term) || nin.includes(term);
    });

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#f3e8ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={24} color="#9333ea" />
                        </div>
                        Citizen Registry
                    </h2>
                    <p style={{ color: 'var(--text-gray)' }}>Central database of all imported NIN records.</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Search color="var(--text-light)" />
                    <input
                        type="text"
                        placeholder="Search by Name or NIN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', fontSize: '1rem', width: '100%', outline: 'none' }}
                    />
                </div>
                <div style={{ height: '1px', backgroundColor: '#eee', width: '100%' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Filter size={16} color="var(--text-gray)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)', fontWeight: '500' }}>Filter by PVC Status:</span>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                    >
                        <option value="ALL">All Citizens</option>
                        <option value="YES">PVC Holders</option>
                        <option value="NO">Non-PVC</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--text-gray)' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Loader2 size={40} color="#9333ea" />
                    </motion.div>
                    <p style={{ marginTop: '1rem' }}>Loading database...</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>Name</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>State</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>LGA</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>PVC Status</th>
                                    <th style={{ padding: '16px', color: 'var(--text-gray)', fontWeight: '600' }}>Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCitizens.map((citizen, index) => (
                                    <motion.tr
                                        key={citizen._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                        whileHover={{ backgroundColor: '#f8fafc' }}
                                        onClick={() => setSelectedCitizen(citizen)}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{citizen.lastName || citizen.surname} {citizen.firstName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>{citizen.ninMasked}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ fontSize: '0.85rem', padding: '4px 10px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '20px' }}>
                                                {citizen.state || citizen.residenceState}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-gray)' }}>{citizen.lga || citizen.residenceLga}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                backgroundColor: citizen.pvcStatus === 'YES' ? '#dcfce7' : '#fee2e2',
                                                color: citizen.pvcStatus === 'YES' ? '#166534' : '#991b1b'
                                            }}>
                                                {citizen.pvcStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-gray)' }}>{citizen.gender}</td>
                                    </motion.tr>
                                ))}
                                {filteredCitizens.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-gray)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                                <Search size={48} color="#e2e8f0" />
                                                <p>No citizen records found for this filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedCitizen && (
                <CitizenDetailModal
                    citizen={selectedCitizen}
                    onClose={() => setSelectedCitizen(null)}
                />
            )}
        </div>
    );
};
export default NINViewerPage;
