  import api from '@/lib/api';
  import { AuthResponse, LoginCredentials, RegisterData, User, Organization } from '@/types';  

  export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      return api.post<AuthResponse>('/auth/login', credentials);
    },

    async register(data: RegisterData): Promise<AuthResponse> {
      return api.post<AuthResponse>('/auth/register', data);
    },

    saveAuth(response: AuthResponse): void {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('organization', JSON.stringify(response.organization));
    },

    clearAuth(): void {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('organization');
    },

    getStoredAuth(): { user: User | null; organization: Organization | null; token: string |   
  null } {
      if (typeof window === 'undefined') {
        return { user: null, organization: null, token: null };
      }

      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const orgStr = localStorage.getItem('organization');

      return {
        token,
        user: userStr ? JSON.parse(userStr) : null,
        organization: orgStr ? JSON.parse(orgStr) : null,
      };
    },

    isAuthenticated(): boolean {
      return !!this.getStoredAuth().token;
    },
  };
