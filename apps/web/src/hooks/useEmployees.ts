  'use client';

  import { useState, useEffect, useCallback } from 'react';
  import { Employee } from '@/types';
  import { employeeService } from '@/services/employee.service';

  export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchEmployees();
    }, [fetchEmployees]);

    return {
      employees,
      isLoading,
      error,
      refetch: fetchEmployees,
    };
  }