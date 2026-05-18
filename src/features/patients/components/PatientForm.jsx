import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema } from '../schemas/patientSchema.js';
import { useCreatePatient } from '../hooks/useCreatePatient.js';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

const PatientForm = ({ onSuccess }) => {
  const { mutate: createPatient, isPending } = useCreatePatient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      age: '',
      gender: 'male',
      phone: '',
    },
  });

  const onSubmit = (data) => {
    createPatient(data, {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Bruce Wayne"
        error={errors.name}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          placeholder="35"
          error={errors.age}
          {...register('age')}
        />

        <div>
          <label className="label">Gender</label>
          <select
            className="input-field"
            {...register('gender')}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender.message}</p>}
        </div>
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1234567890"
        error={errors.phone}
        {...register('phone')}
      />

      <Button type="submit" isLoading={isPending} className="w-full">
        Register Patient
      </Button>
    </form>
  );
};

export default PatientForm;
