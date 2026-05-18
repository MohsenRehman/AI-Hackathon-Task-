import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import LoginForm from '../../features/auth/components/LoginForm.jsx';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-12 w-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 mb-6">
          <Brain className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold font-display text-slate-900 tracking-tight">
          Welcome back to CliniqAI
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-primary-500 hover:text-primary-600 hover:underline transition-all">
            create a new clinic account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-surface-border rounded-2xl shadow-xl sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
