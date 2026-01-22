import { useState, useEffect, useCallback } from 'react';
  import { Department } from '@/types';
  import { departmentService } from '@/services/department.service';

  export function useDepartments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDepartments = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch departments');
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchDepartments();
    }, [fetchDepartments]);

    return {
      departments,
      isLoading,
      error,
      refetch: fetchDepartments,
    };
  }