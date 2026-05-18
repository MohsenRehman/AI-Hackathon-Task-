import api from './axios.instance.js';

export const subscriptionApi = {
  getMyPlan: () => api.get('/subscriptions/my-plan'),
  upgrade: (planType) => api.post('/subscriptions/upgrade', { planType }),
};

export const subscriptionKeys = {
  myPlan: ['subscription', 'myPlan'],
};
