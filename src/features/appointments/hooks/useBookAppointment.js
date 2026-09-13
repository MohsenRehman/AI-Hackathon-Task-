import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentApi, appointmentKeys } from '../../../api/appointment.api.js';

export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData) => {
      const res = await appointmentApi.create(appointmentData);
      return res.data?.data?.appointment || res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Appointment booked successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to book appointment.');
    },
  });
};
