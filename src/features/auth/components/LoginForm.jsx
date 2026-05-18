import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema } from '../schemas/loginSchema.js';
import { useLogin } from '../hooks/useLogin.js';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="doctor@clinic.com"
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

      <div className="flex justify-between items-center text-xs">
        <label className="flex items-center text-slate-500 gap-1.5 cursor-pointer">
          <input type="checkbox" className="rounded text-primary-500 focus:ring-primary-500 border-surface-border" />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-primary-500 font-semibold hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" isLoading={isPending} className="w-full">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
