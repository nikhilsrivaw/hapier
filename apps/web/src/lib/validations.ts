
  import { z } from 'zod';

  export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  export const registerSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    organizationName: z.string().min(2, 'Organization name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

  export const employeeSchema = z.object({
    employeeCode: z.string().min(1, 'Employee code is required'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    address: z.string().optional(),
    joiningDate: z.string().min(1, 'Joining date is required'),
    designation: z.string().min(1, 'Designation is required'),
    salary: z.number().min(0, 'Salary must be positive'),
    departmentId: z.string().min(1, 'Department is required'),
    managerId: z.string().optional(),
  });

  export const departmentSchema = z.object({
    name: z.string().min(2, 'Department name is required'),
  });

  export const leaveRequestSchema = z.object({
    employeeId: z.string().min(1, 'Employee is required'),
    leaveTypeId: z.string().min(1, 'Leave type is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(10, 'Please provide a reason (min 10 characters)'),
  });

  export const leaveTypeSchema = z.object({
    name: z.string().min(2, 'Leave type name is required'),
    daysAllowed: z.number().min(1, 'Days allowed must be at least 1'),
    carryForward: z.boolean().optional(),
    isPaid: z.boolean().optional(),
  });

  export type LoginFormData = z.infer<typeof loginSchema>;
  export type RegisterFormData = z.infer<typeof registerSchema>;
  export type EmployeeFormData = z.infer<typeof employeeSchema>;
  export type DepartmentFormData = z.infer<typeof departmentSchema>;
  export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;
  export type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;