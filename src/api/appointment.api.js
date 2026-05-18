import api from './axios.instance.js';

export const appointmentApi = {
  getAll: (params) => api.get('/appointments', { params }),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
};

export const appointmentKeys = {
  all: ['appointments'],
  list: (filters) => ['appointments', 'list', filters],
  detail: (id) => ['appointments', 'detail', id],
};
