import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

// FIX 5: Parse JWT to check expiry on the client
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch { return true; }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      _setAuth: (user, token) => {
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        else delete api.defaults.headers.common['Authorization'];
        set({ user, token, error: null });
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/register', data);
          set({ isLoading: false });
          return { success: true, message: res.data.message };
        } catch (err) {
          const msg = err.response?.data?.message || err.message || 'Registration failed';
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      verifyEmail: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/verify-email', { email, code });
          get()._setAuth(res.data.user, res.data.token);
          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Invalid code';
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      resendCode: async (email) => {
        try {
          await api.post('/auth/resend-code', { email });
          return { success: true };
        } catch (err) {
          return { success: false, error: err.response?.data?.message || 'Failed to resend' };
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/login', { email, password });
          get()._setAuth(res.data.user, res.data.token);
          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed';
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },

      // FIX 5: Check if stored token is still valid
      checkTokenValidity: () => {
        const { token } = get();
        if (token && isTokenExpired(token)) {
          delete api.defaults.headers.common['Authorization'];
          set({ user: null, token: null });
          return false;
        }
        return !!token;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'jeyp-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // FIX 5: Don't restore expired tokens
          if (isTokenExpired(state.token)) {
            state.user = null;
            state.token = null;
          } else {
            api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          }
        }
      },
    }
  )
);
