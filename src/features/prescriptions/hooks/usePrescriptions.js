import { useQuery } from '@tanstack/react-query';
import { prescriptionApi, prescriptionKeys } from '../../../api/prescription.api.js';

export const usePrescriptions = (filters = {}) => {
  return useQuery({
    queryKey: prescriptionKeys.list(filters),
    queryFn: async () => {
      const res = await prescriptionApi.getAll(filters);
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};
