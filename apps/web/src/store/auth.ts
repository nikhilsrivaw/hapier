
  import { create } from 'zustand';
  import { User, Organization } from '@/types';
  import api from '@/lib/api';

  interface AuthState {
    user: User | null;
    organization: Organization | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (data: {
      email: string;
      password: string;
      organizationName: string;
      firstName: string;
      lastName: string;
    }) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
  }

  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    organization: null,
    isLoading: true,
    isAuthenticated: false,

    login: async (email, password) => {
      const response = await api.post('/auth/login', { email, password });
      const { token, user, organization } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('organization', JSON.stringify(organization));

      set({ user, organization, isAuthenticated: true });
    },

    register: async (data) => {
      const response = await api.post('/auth/register', data);
      const { token, user, organization } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('organization', JSON.stringify(organization));

      set({ user, organization, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('organization');
      set({ user: null, organization: null, isAuthenticated: false });
    },

    checkAuth: () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const orgStr = localStorage.getItem('organization');

      if (token && userStr && orgStr) {
        set({
          user: JSON.parse(userStr),
          organization: JSON.parse(orgStr),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    },
  }));