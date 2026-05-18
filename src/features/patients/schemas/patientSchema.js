import * as z from 'zod';

export const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Age cannot exceed 120'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select gender' }),
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +1234567890)'),
});
