import * as z from 'zod';

export const symptomSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  symptoms: z.array(z.string()).min(1, 'Please add at least one symptom'),
  notes: z.string().optional(),
});
