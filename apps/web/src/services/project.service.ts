import api from '@/lib/api';                                                                       
  import { Project } from '@/types';                                                                 

  export const projectService = {
      async getAll(): Promise<Project[]> {
          return api.get('/projects');
      },

      async getById(id: string): Promise<Project> {
          return api.get(`/projects/${id}`);
      },

      async create(data: {
          name: string;
          description?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
      }): Promise<Project> {
          return api.post('/projects', data);
      },

      async update(id: string, data: {
          name?: string;
          description?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
          ownerId?: string;
      }): Promise<Project> {
          return api.put(`/projects/${id}`, data);
      },

      async delete(id: string): Promise<{ message: string }> {
          return api.delete(`/projects/${id}`);
      },
  };
