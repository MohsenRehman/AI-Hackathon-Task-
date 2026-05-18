import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../../api/auth.api.js';
import useAuthStore from '../../../store/authStore.js';
import { ROLES } from '../../../utils/constants.js';

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (credentials) => {
      const res = await authApi.login(credentials);
      return res.data?.data;
    },
    onSuccess: (data) => {
      const { user, accessToken } = data;
      setUser(user, accessToken);
      toast.success(`Welcome back, ${user.name}!`);

      // Role-based redirects
      switch (user.role) {
        case ROLES.ADMIN:
          navigate('/admin/dashboard');
          break;
        case ROLES.DOCTOR:
          navigate('/doctor/dashboard');
          break;
        case ROLES.RECEPTIONIST:
          navigate('/receptionist/dashboard');
          break;
        case ROLES.PATIENT:
          navigate('/patient/dashboard');
          break;
        default:
          navigate('/unauthorized');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    },
  });
};
