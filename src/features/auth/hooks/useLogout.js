import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../../api/auth.api.js';
import useAuthStore from '../../../store/authStore.js';

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      // Clear auth anyway to prevent stuck states
      clearAuth();
      navigate('/login');
    },
  });
};
