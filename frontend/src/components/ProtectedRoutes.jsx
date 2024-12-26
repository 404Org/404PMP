import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';

const ProtectedRoutes = ({ authenticationRequired }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  // Authentication-related paths
  const authPaths = ["/", "/signup", "/forgotpassword", "/resetpassword"];

  if (authenticationRequired) {
    // Redirect to login page if authentication is required and user is not authenticated
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  }

  if (isAuthenticated) {
    // Prevent access to authentication-related routes when authenticated
    if (authPaths.includes(location.pathname)) {
      return <Navigate to="/home" replace />;
    }
  }

  // If the route doesn't match any valid path, render a 404 page
  return isAuthenticated ? <NotFoundPage/> : <Outlet />;
};

export default ProtectedRoutes;
