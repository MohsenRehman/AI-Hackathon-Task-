import * as z from 'zod';

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  scheduledAt: z.string().min(1, 'Please select an appointment date & time')
    .refine((val) => new Date(val) > new Date(), 'Appointment must be in the future'),
  type: z.enum(['in-person', 'telemedicine'], {
    errorMap: () => ({ message: 'Please select appointment type' }),
  }),
  duration: z.coerce.number().min(15).max(60),
});
