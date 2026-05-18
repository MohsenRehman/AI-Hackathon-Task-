import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import { useRole } from '../hooks/useRole.js';
import { ROLES } from '../utils/constants.js';

// Lazy load pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage.jsx'));
const UnauthorizedPage = lazy(() => import('../pages/shared/UnauthorizedPage.jsx'));
const UpgradePage = lazy(() => import('../pages/billing/UpgradePage.jsx'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage.jsx'));
const SubscriptionsPage = lazy(() => import('../pages/admin/SubscriptionsPage.jsx'));
const UsersPage = lazy(() => import('../pages/admin/UsersPage.jsx'));
const SystemMonitorPage = lazy(() => import('../pages/admin/SystemMonitorPage.jsx'));
const MarketingHubPage = lazy(() => import('../pages/admin/MarketingHubPage.jsx'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('../pages/doctor/DoctorDashboard.jsx'));
const PatientsPage = lazy(() => import('../pages/doctor/PatientsPage.jsx'));
const DiagnosisWizardPage = lazy(() => import('../pages/doctor/DiagnosisWizardPage.jsx'));
const PrescriptionsPage = lazy(() => import('../pages/doctor/PrescriptionsPage.jsx'));

// Receptionist Pages
const ReceptionistDashboard = lazy(() => import('../pages/receptionist/ReceptionistDashboard.jsx'));
const AppointmentsPage = lazy(() => import('../pages/receptionist/AppointmentsPage.jsx'));

// Patient Pages
const PatientDashboard = lazy(() => import('../pages/patient/PatientDashboard.jsx'));
const PatientPrescriptionsPage = lazy(() => import('../pages/patient/PatientPrescriptionsPage.jsx'));
const PatientAppointmentsPage = lazy(() => import('../pages/patient/PatientAppointmentsPage.jsx'));

const RootRedirect = () => {
  const { role, isHydrating } = useRole();

  if (isHydrating) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  switch (role) {
    case ROLES.ADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    case ROLES.DOCTOR:
      return <Navigate to="/doctor/dashboard" replace />;
    case ROLES.RECEPTIONIST:
      return <Navigate to="/receptionist/dashboard" replace />;
    case ROLES.PATIENT:
      return <Navigate to="/patient/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const LoadingSpinner = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-surface">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Root Route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Shared Protected Billing Route */}
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <UpgradePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Tier Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminAnalyticsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subscriptions"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <SubscriptionsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <UsersPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/system"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <SystemMonitorPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/marketing"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <MarketingHubPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Doctor Tier Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
                <DoctorDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
                <PatientsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/diagnosis"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
                <DiagnosisWizardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
                <PrescriptionsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Receptionist Tier Routes */}
        <Route
          path="/receptionist/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <ReceptionistDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist/appointments"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.PATIENT]}>
                <AppointmentsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Patient Tier Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <PatientDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <PatientPrescriptionsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[ROLES.PATIENT]}>
                <PatientAppointmentsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
