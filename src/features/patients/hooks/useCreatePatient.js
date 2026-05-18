import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { patientApi, patientKeys } from '../../../api/patient.api.js';

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientData) => {
      const res = await patientApi.create(patientData);
      return res.data?.data?.patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      toast.success('Patient registered successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to register patient.');
    },
  });
};
