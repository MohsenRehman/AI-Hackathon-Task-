import { useQuery } from '@tanstack/react-query';
import { patientApi, patientKeys } from '../../../api/patient.api.js';

export const usePatients = (filters = {}) => {
  return useQuery({
    queryKey: patientKeys.list(filters),
    queryFn: async () => {
      const res = await patientApi.getAll(filters);
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });
};
