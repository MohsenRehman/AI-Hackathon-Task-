import api from './axios.instance.js';

export const analyticsApi = {
  getAdminStats: () => api.get('/analytics/admin'),
  getDoctorStats: () => api.get('/analytics/doctor'),
};

export const analyticsKeys = {
  admin: ['analytics', 'admin'],
  doctor: ['analytics', 'doctor'],
};
