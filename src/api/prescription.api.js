import api from './axios.instance.js';

export const prescriptionApi = {
  getAll: (params) => api.get('/prescriptions', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  download: (id) => api.get(`/prescriptions/${id}/download`, { maxRedirects: 0 }).catch((e) => e),
};

export const prescriptionKeys = {
  all: ['prescriptions'],
  list: (filters) => ['prescriptions', 'list', filters],
  detail: (id) => ['prescriptions', 'detail', id],
};
