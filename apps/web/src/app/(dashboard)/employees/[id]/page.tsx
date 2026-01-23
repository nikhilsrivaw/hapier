
  'use client';

  import { useState, useEffect } from 'react';
  import { useParams } from 'next/navigation';
  import { employeeService } from '@/services/employee.service';
  import { Employee } from '@/types';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import EmployeeProfile from '@/components/employees/EmployeeProfile';
  import { LoadingSpinner, ErrorMessage } from '@/components/common';

  export default function EmployeeDetailPage() {
    const params = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchEmployee = async () => {
        try {
          const data = await employeeService.getById(params.id as string);
          setEmployee(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch employee');
        } finally {
          setIsLoading(false);
        }
      };

      if (params.id) fetchEmployee();
    }, [params.id]);

    if (isLoading) {
      return (
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      );
    }

    if (error || !employee) {
      return (
        <DashboardLayout>
          <ErrorMessage message={error || 'Employee not found'} />
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout>
        <EmployeeProfile employee={employee} />
      </DashboardLayout>
    );
  }