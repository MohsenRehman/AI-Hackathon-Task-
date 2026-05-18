import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { diagnosisApi, diagnosisKeys } from '../../../api/diagnosis.api.js';

export const useAIDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (symptomData) => {
      const res = await diagnosisApi.checkSymptoms(symptomData);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diagnosisKeys.history() });
      toast.success('AI Diagnosis complete!');
    },
    onError: (err) => {
      toast.error(err.message || 'AI Diagnosis failed.');
    },
  });
};
