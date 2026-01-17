import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { AnimatePresence } from 'framer-motion';

// This special file wraps all routes in this directory and below
// We use it to apply the global Layout and AnimatePresence
export default function PathLayout() {
    const location = useLocation();

    return (
        <Layout>
            <AnimatePresence mode="wait">
                {/* We must pass key to Outlet context or wrap Outlet? 
            Actually AnimatePresence works best with Routes, but here we have Outlet.
            Common pattern with file-routes is wrapping the specific page component.
            But let's try wrapping the Outlet with a div key.
        */}
                <div key={location.pathname} style={{ width: '100%' }}>
                    <Outlet />
                </div>
            </AnimatePresence>
        </Layout>
    );
}
