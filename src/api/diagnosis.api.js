import api from './axios.instance.js';

export const diagnosisApi = {
  checkSymptoms: (data) => api.post('/diagnosis/ai', data),
  explain: (prescriptionId, language) =>
    api.get(`/diagnosis/explain/${prescriptionId}`, { params: { language } }),
  explainPrescription: (prescriptionId, isUrdu) =>
    api.get(`/diagnosis/explain/${prescriptionId}`, {
      params: { language: isUrdu === true || isUrdu === 'ur' ? 'ur' : 'en' },
    }),
};

export const diagnosisKeys = {
  all: ['diagnosis'],
  history: () => ['diagnosis', 'history'],
};
