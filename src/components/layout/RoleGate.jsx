import React from 'react';
import { useRole } from '../../hooks/useRole.js';

const RoleGate = ({ allowedRoles, children, fallback = null }) => {
  const { canAccess } = useRole();

  if (!canAccess(allowedRoles)) {
    return fallback;
  }

  return children;
};

export default RoleGate;
