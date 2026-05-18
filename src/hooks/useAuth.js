import useAuthStore from '../store/authStore.js';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setUser, clearAuth, hydrateFromServer } = useAuthStore();
  return { user, isAuthenticated, isLoading, setUser, clearAuth, hydrateFromServer };
};
