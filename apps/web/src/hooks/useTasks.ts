  import { useState, useEffect, useCallback } from 'react';                                          
  import { taskService } from '@/services/task.service';
  import { Task } from '@/types';

  export function useTasks(filters?: { status?: string; assigneeId?: string; priority?: string }) {  
      const [tasks, setTasks] = useState<Task[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchTasks = useCallback(async () => {
          setIsLoading(true);
          setError(null);
          try {
              const data = await taskService.getAll(filters);
              setTasks(data);
          } catch (err: any) {
              setError(err.message || 'Failed to fetch tasks');
          } finally {
              setIsLoading(false);
          }
      }, [filters?.status, filters?.assigneeId, filters?.priority]);

      useEffect(() => {
          fetchTasks();
      }, [fetchTasks]);

      const createTask = async (data: {
          title: string;
          description?: string;
          status?: string;
          priority?: string;
          dueDate?: string;
          assigneeId?: string;
          projectId?: string;
      }) => {
          const newTask = await taskService.create(data);
          setTasks((prev) => [newTask, ...prev]);
          return newTask;
      };

      const updateTask = async (id: string, data: {
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          dueDate?: string;
          assigneeId?: string | null;
          projectId?: string | null;
      }) => {
          const updatedTask = await taskService.update(id, data);
          setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
          return updatedTask;
      };

      const deleteTask = async (id: string) => {
          await taskService.delete(id);
          setTasks((prev) => prev.filter((t) => t.id !== id));
      };

      return {
          tasks,
          isLoading,
          error,
          refetch: fetchTasks,
          createTask,
          updateTask,
          deleteTask,
      };
  }