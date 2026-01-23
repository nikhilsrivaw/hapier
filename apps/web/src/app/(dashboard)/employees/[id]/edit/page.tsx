 'use client';

  import { useState, useEffect } from 'react';
  import { useParams, useRouter } from 'next/navigation';
  import { useDepartments } from '@/hooks';
  import { employeeService } from '@/services/employee.service';
  import { Employee } from '@/types';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import EmployeeForm from '@/components/employees/EmployeeForm';
  import { LoadingSpinner, ErrorMessage } from '@/components/common';

  export default function EditEmployeePage() {
    const params = useParams();
    const router = useRouter();
    const { departments } = useDepartments();
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

    const handleSubmit = async (formData: any) => {
      await employeeService.update(params.id as string, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address || undefined,
        designation: formData.designation,
        salary: parseFloat(formData.salary),
        departmentId: formData.departmentId,
        status: formData.status,
      });
      router.push(`/employees/${params.id}`);
    };

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

    const initialData = {
      employeeCode: employee.employeeCode,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      gender: employee.gender || '',
      dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
      address: employee.address || '',
      joiningDate: employee.joiningDate.split('T')[0],
      designation: employee.designation,
      salary: employee.salary.toString(),
      departmentId: employee.departmentId,
      status: employee.status,
    };

    return (
      <DashboardLayout>
        <EmployeeForm
          initialData={initialData}
          departments={departments}
          onSubmit={handleSubmit}
          isEdit
        />
      </DashboardLayout>
    );
  }
