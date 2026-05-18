import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
      <div className="p-4 bg-red-100 text-red-600 rounded-full mb-6">
        <ShieldAlert className="h-12 w-12 animate-bounce" />
      </div>
      <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Access Denied</h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        You do not have the required permissions to view this resource. If you believe this is an error, please contact your administrator.
      </p>
      
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
