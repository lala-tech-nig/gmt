import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import SuccessPage from './pages/SuccessPage';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UploadPage from './pages/admin/UploadPage';
import NINViewerPage from './pages/admin/NINViewerPage';
import RegisteredUsersPage from './pages/admin/RegisteredUsersPage';
import BoardDashboardPage from './pages/admin/BoardDashboardPage';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="success" element={<SuccessPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/upload" element={<UploadPage />} />
          <Route path="admin/registrations" element={<RegisteredUsersPage />} />
          <Route path="admin/nins" element={<NINViewerPage />} />
          <Route path="board/dashboard" element={<BoardDashboardPage />} />
          <Route path="admin/non-pvc" element={<h2 className="container">Non-PVC Engagement (Coming Soon)</h2>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
