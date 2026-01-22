 import api from '@/lib/api';
  import { Employee, CreateEmployeeData, UpdateEmployeeData } from '@/types';

  export const employeeService = {
    async getAll(): Promise<Employee[]> {
      return api.get<Employee[]>('/employees');
    },

    async getById(id: string): Promise<Employee> {
      return api.get<Employee>(`/employees/${id}`);
    },

    async create(data: CreateEmployeeData): Promise<Employee> {
      return api.post<Employee>('/employees', data);
    },

    async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
      return api.put<Employee>(`/employees/${id}`, data);
    },

    async delete(id: string): Promise<{ message: string }> {
      return api.delete<{ message: string }>(`/employees/${id}`);
    },
  };