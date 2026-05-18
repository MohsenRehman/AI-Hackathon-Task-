import { useAuth } from './useAuth.js';
import { ROLES } from '../utils/constants.js';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;

  const hasRole = (...roles) => roles.includes(role);

  const isAdmin = role === ROLES.ADMIN;
  const isDoctor = role === ROLES.DOCTOR;
  const isReceptionist = role === ROLES.RECEPTIONIST;
  const isPatient = role === ROLES.PATIENT;

  const canAccess = (allowedRoles) => allowedRoles.includes(role);

  return { role, hasRole, canAccess, isAdmin, isDoctor, isReceptionist, isPatient };
};
