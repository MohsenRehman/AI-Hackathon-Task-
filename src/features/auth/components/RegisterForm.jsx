import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/registerSchema.js';
import { useRegister } from '../hooks/useRegister.js';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

const RegisterForm = () => {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'patient',
    },
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="Dr. Sarah Connor"
        error={errors.name}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="sarah@clinic.com"
        error={errors.email}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password}
        {...register('password')}
      />

      <div>
        <label className="label">Account Role</label>
        <select
          className="input-field"
          error={errors.role}
          {...register('role')}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="receptionist">Receptionist</option>
          <option value="admin">Administrator</option>
        </select>
        {errors.role && <p className="error-text">{errors.role.message}</p>}
      </div>

      <Button type="submit" isLoading={isPending} className="w-full">
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
