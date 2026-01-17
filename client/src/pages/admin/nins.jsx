import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import CitizenDetailModal from '../../components/CitizenDetailModal';

const NINViewerPage = () => {
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, YES, NO
    const [selectedCitizen, setSelectedCitizen] = useState(null);

    useEffect(() => {
        const fetchCitizens = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const params = {};
                if (filter !== 'ALL') params.pvcStatus = filter;

                const res = await axios.get('https://gmt-b7oh.onrender.com/api/admin/citizens', {
                    headers: { Authorization: `Bearer ${token}` },
                    params
                });
                if (res.data.success) {
                    setCitizens(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching citizens:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCitizens();
    }, [filter]);

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: 'var(--primary-color)' }}>Citizen Registry</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                    <option value="ALL">All Citizens</option>
                    <option value="YES">PVC Holders</option>
                    <option value="NO">Non-PVC</option>
                </select>
            </div>

            {loading ? (
                <p>Loading records...</p>
            ) : (
                <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--white)' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>Name</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>State</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>LGA</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>PVC Status</th>
                                <th style={{ padding: '16px', borderBottom: '2px solid #dee2e6' }}>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citizens.map((citizen, index) => (
                                <motion.tr
                                    key={citizen._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{ borderBottom: '1px solid #dee2e6', cursor: 'pointer' }}
                                    whileHover={{ backgroundColor: '#f1f8f4' }}
                                    onClick={() => setSelectedCitizen(citizen)}
                                >
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500' }}>{citizen.lastName || citizen.surname} {citizen.firstName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#999' }}>{citizen.ninMasked}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{citizen.state || citizen.residenceState}</td>
                                    <td style={{ padding: '16px' }}>{citizen.lga || citizen.residenceLga}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            backgroundColor: citizen.pvcStatus === 'YES' ? '#d4edda' : '#f8d7da',
                                            color: citizen.pvcStatus === 'YES' ? '#155724' : '#721c24'
                                        }}>
                                            {citizen.pvcStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>{citizen.gender}</td>
                                </motion.tr>
                            ))}
                            {citizens.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                                        No citizen records found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
