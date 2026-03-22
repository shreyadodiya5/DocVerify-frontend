import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader';
import { isManagerUser, isClientUser } from '../utils/roles';

const roleAllowed = (user, managerOnly, clientOnly) => {
  if (!managerOnly && !clientOnly) return true;
  if (managerOnly && isManagerUser(user)) return true;
  if (clientOnly && isClientUser(user)) return true;
  return false;
};

const ProtectedRoute = ({ children, managerOnly: needManager, clientOnly: needClient }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!roleAllowed(user, needManager, needClient)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
