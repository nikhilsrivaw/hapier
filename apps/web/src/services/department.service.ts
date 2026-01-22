 import api from '@/lib/api';
  import { Department, CreateDepartmentData } from '@/types';

  export const departmentService = {
    async getAll(): Promise<Department[]> {
      return api.get<Department[]>('/departments');
    },

    async getById(id: string): Promise<Department> {
      return api.get<Department>(`/departments/${id}`);
    },

    async create(data: CreateDepartmentData): Promise<Department> {
      return api.post<Department>('/departments', data);
    },

    async update(id: string, data: CreateDepartmentData): Promise<Department> {
      return api.put<Department>(`/departments/${id}`, data);
    },

    async delete(id: string): Promise<{ message: string }> {
      return api.delete<{ message: string }>(`/departments/${id}`);
    },
  };
