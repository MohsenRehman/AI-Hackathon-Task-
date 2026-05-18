import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { prescriptionApi, prescriptionKeys } from '../../../api/prescription.api.js';

import useAuthStore from '../../../store/authStore.js';

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prescriptionData) => {
      const res = await prescriptionApi.create(prescriptionData);
      return res.data?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
      toast.success('Prescription saved successfully!');
      
      // Auto open PDF if returned in response
      if (data?.pdfUrl) {
        const token = useAuthStore.getState().accessToken;
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
        const url = data.pdfUrl.startsWith('/')
          ? `${baseURL}${data.pdfUrl}`
          : data.pdfUrl;
        const delimiter = url.includes('?') ? '&' : '?';
        window.open(`${url}${delimiter}token=${token}`, '_blank');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create prescription.');
    },
  });
};
