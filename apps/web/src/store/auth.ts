  import { create } from 'zustand';                                                            
  import { User, Organization, AuthResponse } from '@/types';
  import { authService } from '@/services/auth.service';

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

    login: async (email: string, password: string) => {
      const response: AuthResponse = await authService.login({ email, password });

      authService.saveAuth(response);

      set({
        user: response.user,
        organization: response.organization,
        isAuthenticated: true,
      });
    },

    register: async (data) => {
      const response: AuthResponse = await authService.register(data);

      authService.saveAuth(response);

      set({
        user: response.user,
        organization: response.organization,
        isAuthenticated: true,
      });
    },

    logout: () => {
      authService.clearAuth();
      set({
        user: null,
        organization: null,
        isAuthenticated: false,
      });
    },

    checkAuth: () => {
      const { user, organization, token } = authService.getStoredAuth();

      if (token && user && organization) {
        set({
          user,
          organization,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    },
  }));