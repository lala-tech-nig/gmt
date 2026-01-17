import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/board');

    return (
        <div className="layout">
            {/* Header */}
            <header style={{
                backgroundColor: 'var(--white)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                padding: '1rem 0'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        CivicConnect Gets
                    </Link>

                    <nav>
                        {!isAdmin ? (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Link to="/" className="text-primary">Home</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Admin Portal</span>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0', backgroundColor: 'var(--bg-light)' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer style={{ backgroundColor: '#333', color: '#fff', padding: '2rem 0', textAlign: 'center', fontSize: '0.9rem' }}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Civic Engagement System. Not for voting purposes.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
