'use client';

  import { useRouter } from 'next/navigation';
  import { useDepartments } from '@/hooks';
  import { employeeService } from '@/services/employee.service';
  import { ROUTES } from '@/config/constants';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import EmployeeForm from '@/components/employees/EmployeeForm';

  export default function NewEmployeePage() {
    const router = useRouter();
    const { departments } = useDepartments();

    const handleSubmit = async (formData: any) => {
      await employeeService.create({
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address || undefined,
        joiningDate: formData.joiningDate,
        designation: formData.designation,
        salary: parseFloat(formData.salary),
        departmentId: formData.departmentId,
      });
      router.push(ROUTES.EMPLOYEES);
    };

    return (
      <DashboardLayout>
        <EmployeeForm departments={departments} onSubmit={handleSubmit} />
      </DashboardLayout>
    );
  }