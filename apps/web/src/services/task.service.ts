import api from '@/lib/api';                                                                       
  import { Task } from '@/types';

  export const taskService = {
      async getAll(filters?: { status?: string; assigneeId?: string; priority?: string }):
  Promise<Task[]> {
          const params = new URLSearchParams();
          if (filters?.status) params.append('status', filters.status);
          if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);
          if (filters?.priority) params.append('priority', filters.priority);

          const query = params.toString();
          return api.get(`/tasks${query ? `?${query}` : ''}`);
      },

      async getById(id: string): Promise<Task> {
          return api.get(`/tasks/${id}`);
      },

      async create(data: {
          title: string;
          description?: string;
          status?: string;
          priority?: string;
          dueDate?: string;
          assigneeId?: string;
      }): Promise<Task> {
          return api.post('/tasks', data);
      },

      async update(id: string, data: {
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          dueDate?: string;
          assigneeId?: string | null;
      }): Promise<Task> {
          return api.put(`/tasks/${id}`, data);
      },

      async delete(id: string): Promise<{ message: string }> {
          return api.delete(`/tasks/${id}`);
      },
  };
