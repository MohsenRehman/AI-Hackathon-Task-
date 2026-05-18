import api from './axios.instance.js';

export const diagnosisApi = {
  checkSymptoms: (data) => api.post('/diagnosis/ai', data),
  explain: (prescriptionId, language) =>
    api.get(`/diagnosis/explain/${prescriptionId}`, { params: { language } }),
};

export const diagnosisKeys = {
  all: ['diagnosis'],
  history: () => ['diagnosis', 'history'],
};
