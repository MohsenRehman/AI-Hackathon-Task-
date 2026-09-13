import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentApi, appointmentKeys } from '../../../api/appointment.api.js';

export const useUpdateAppointmentStatus = (filters = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await appointmentApi.updateStatus(id, status);
      return res.data?.data?.appointment || res.data?.data;
    },
    // Optimistic Update Hook
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: appointmentKeys.list(filters) });

      // Snapshot the previous value
      const previousAppointments = queryClient.getQueryData(appointmentKeys.list(filters));

      // Optimistically update to the new value
      queryClient.setQueryData(appointmentKeys.list(filters), (old) => {
        if (!old) return [];
        return old.map((appt) => 
          appt._id === id ? { ...appt, status } : appt
        );
      });

      // Return a context object with the snapshotted value
      return { previousAppointments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newVariables, context) => {
      if (context?.previousAppointments) {
        queryClient.setQueryData(appointmentKeys.list(filters), context.previousAppointments);
      }
      toast.error(err.message || 'Failed to update appointment status.');
    },
    // Always refetch after success or error
    onSuccess: (data) => {
      toast.success(`Appointment status updated to ${data.status}!`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};
