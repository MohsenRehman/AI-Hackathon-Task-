import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../api/axios.instance.js';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user, accessToken) => {
        set({ 
          user, 
          accessToken: accessToken || get().accessToken, 
          isAuthenticated: !!user 
        });
      },

      clearAuth: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      hydrateFromServer: async () => {
        const token = get().accessToken;
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const res = await axios.get('/auth/me');
          const user = res.data?.data?.user;
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cliniq-auth',
      storage: {
        getItem: (key) => {
          const val = localStorage.getItem(key);
          return val ? JSON.parse(val) : null;
        },
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
      partialState: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
