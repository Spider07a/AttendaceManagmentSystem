import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthGuard = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized role, optionally redirect them to their respective dashboards
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
