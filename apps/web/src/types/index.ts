  export interface User {
    id: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'HR_MANAGER' | 'MANAGER' | 'EMPLOYEE';
  }

  export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  }

  export interface Department {
    id: string;
    name: string;
    _count?: {
      employees: number;
    };
  }

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
    status: 'ACTIVE' | 'ON_NOTICE' | 'TERMINATED' | 'ON_LEAVE';
    departmentId: string;
    department?: Department;
    managerId?: string;
  }

  export interface Attendance {
    id: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'ON_LEAVE';
    notes?: string;
    employeeId: string;
    employee?: Employee;
  }

  export interface LeaveType {
    id: string;
    name: string;
    daysAllowed: number;
    carryForward: boolean;
    isPaid: boolean;
  }

  export interface LeaveRequest {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    leaveTypeId: string;
    leaveType?: LeaveType;
    employeeId: string;
    employee?: Employee;
  }

  export interface DashboardStats {
    totalEmployees: number;
    activeEmployees: number;
    departments: number;
    todayAttendance: number;
    pendingLeaves: number;
    attendancePercentage: number;
  }

  export interface AuthResponse {
    token: string;
    user: User;
    organization: Organization;
  }
