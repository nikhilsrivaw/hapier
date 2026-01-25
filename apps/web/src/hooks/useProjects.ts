 import { useState, useEffect, useCallback } from 'react';                                          
  import { projectService } from '@/services/project.service';                                       
  import { Project } from '@/types';

  export function useProjects() {
      const [projects, setProjects] = useState<Project[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchProjects = useCallback(async () => {
          setIsLoading(true);
          setError(null);
          try {
              const data = await projectService.getAll();
              setProjects(data);
          } catch (err: any) {
              setError(err.message || 'Failed to fetch projects');
          } finally {
              setIsLoading(false);
          }
      }, []);

      useEffect(() => {
          fetchProjects();
      }, [fetchProjects]);

      const createProject = async (data: {
          name: string;
          description?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
      }) => {
          const newProject = await projectService.create(data);
          setProjects((prev) => [newProject, ...prev]);
          return newProject;
      };

      const updateProject = async (id: string, data: {
          name?: string;
          description?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
          ownerId?: string;
      }) => {
          const updatedProject = await projectService.update(id, data);
          setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));
          return updatedProject;
      };

      const deleteProject = async (id: string) => {
          await projectService.delete(id);
          setProjects((prev) => prev.filter((p) => p.id !== id));
      };

      return {
          projects,
          isLoading,
          error,
          refetch: fetchProjects,
          createProject,
          updateProject,
          deleteProject,
      };
  }