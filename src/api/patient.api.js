import api from './axios.instance.js';

export const patientApi = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export const patientKeys = {
  all: ['patients'],
  list: (filters) => ['patients', 'list', filters],
  detail: (id) => ['patients', 'detail', id],
};
