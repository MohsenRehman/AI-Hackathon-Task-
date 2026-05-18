import { useQuery } from '@tanstack/react-query';
import { appointmentApi, appointmentKeys } from '../../../api/appointment.api.js';

export const useAppointments = (filters = {}) => {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: async () => {
      const res = await appointmentApi.getAll(filters);
      return res.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};
