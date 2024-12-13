import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ authenticationRequired }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (authenticationRequired) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  }
  
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export default ProtectedRoutes;