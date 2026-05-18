import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole.js';

const RoleRoute = ({ allowedRoles, children }) => {
  const { canAccess } = useRole();

  if (!canAccess(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
