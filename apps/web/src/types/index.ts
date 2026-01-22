
  import { ROLES, EMPLOYEE_STATUS, LEAVE_STATUS, ATTENDANCE_STATUS } from '@/config/constants';

  // Utility types
  export type ValueOf<T> = T[keyof T];

  // Role types
  export type Role = ValueOf<typeof ROLES>;
  export type EmployeeStatus = ValueOf<typeof EMPLOYEE_STATUS>;
  export type LeaveStatus = ValueOf<typeof LEAVE_STATUS>;
  export type AttendanceStatus = ValueOf<typeof ATTENDANCE_STATUS>;

  // API Response types
  export interface ApiResponse<T> {
    data: T;
    message?: string;
  }

  export interface ApiError {
    error: string;
    statusCode?: number;
  }

  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

  // Auth types
  export interface User {
    id: string;
    email: string;
    role: Role;
  }

  export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  }

  export interface AuthResponse {
    token: string;
    user: User;
    organization: Organization;
  }

  export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface RegisterData {
    email: string;
    password: string;
    organizationName: string;
    firstName: string;
    lastName: string;
  }

  // Department types
  export interface Department {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    _count?: {
      employees: number;
    };
  }

  export interface CreateDepartmentData {
    name: string;
  }

  // Employee types
  export interface Employee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    joiningDate: string;
    designation: string;
    salary: string;
    status: EmployeeStatus;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    departmentId: string;
    department?: Department;
    managerId?: string;
    manager?: Pick<Employee, 'id' | 'firstName' | 'lastName'>;
    userId?: string;
    user?: {
      email: string;
      role: Role;
      isActive: boolean;
    };
  }

  export interface CreateEmployeeData {
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    joiningDate: string;
    designation: string;
    salary: number;
    departmentId: string;
    managerId?: string;
  }

  export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
    status?: EmployeeStatus;
  }

  // Attendance types
  export interface Attendance {
    id: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: AttendanceStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    employeeId: string;
    employee?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeCode' | 'department'>;
  }

  export interface MarkAttendanceData {
    employeeId: string;
    date: string;
    status: AttendanceStatus;
    checkIn?: string;
    checkOut?: string;
    notes?: string;
  }

  // Leave types
  export interface LeaveType {
    id: string;
    name: string;
    daysAllowed: number;
    carryForward: boolean;
    isPaid: boolean;
    organizationId: string;
  }

  export interface CreateLeaveTypeData {
    name: string;
    daysAllowed: number;
    carryForward?: boolean;
    isPaid?: boolean;
  }

  export interface LeaveRequest {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    createdAt: string;
    updatedAt: string;
    employeeId: string;
    leaveTypeId: string;
    approvedById?: string;
    leaveType?: LeaveType;
    employee?: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeCode' | 'department'>;
  }

  export interface CreateLeaveRequestData {
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }

  // Dashboard types
  export interface DashboardStats {
    totalEmployees: number;
    activeEmployees: number;
    departments: number;
    todayAttendance: number;
    pendingLeaves: number;
    attendancePercentage: number;
  }

