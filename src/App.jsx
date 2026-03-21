import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import RequestForm from './pages/RequestForm';
import RequestDetail from './pages/RequestDetail';

// Client Upload Flow
import UploadPage from './pages/UploadPage';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes (Person A) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requests/new" 
        element={
          <ProtectedRoute>
            <RequestForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/requests/:id" 
        element={
          <ProtectedRoute>
            <RequestDetail />
          </ProtectedRoute>
        } 
      />

      {/* Public — no auth; Person B uses magic link from email/SMS */}
      <Route path="/upload/:token" element={<UploadPage />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
