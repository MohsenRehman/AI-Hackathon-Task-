import * as z from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g., 500mg)'),
  frequency: z.string().min(1, 'Frequency is required (e.g., Once Daily)'),
  duration: z.string().min(1, 'Duration is required (e.g., 7 Days)'),
  notes: z.string().optional(),
});

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  diagnosis: z.string().min(2, 'Diagnosis is required'),
  medicines: z.array(medicineSchema).min(1, 'Please add at least one medicine'),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
  isUrdu: z.boolean().default(false),
});
