import api from '@/lib/api';
  import { Organization, DashboardStats } from '@/types';

  export const organizationService = {
    async get(): Promise<Organization> {
      return api.get<Organization>('/organization');
    },

    async update(data: Partial<Organization>): Promise<Organization> {
      return api.put<Organization>('/organization', data);
    },

    async getDashboardStats(): Promise<DashboardStats> {
      return api.get<DashboardStats>('/organization/dashboard');
    },
  };
