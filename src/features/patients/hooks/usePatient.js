import { useQuery } from '@tanstack/react-query';
import { patientApi, patientKeys } from '../../../api/patient.api.js';

export const usePatient = (id) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const res = await patientApi.getById(id);
      return res.data?.data?.patient || null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
