import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../config';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.email !== ADMIN_EMAIL) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
