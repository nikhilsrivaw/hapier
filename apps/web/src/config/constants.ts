export const APP_NAME = 'Hapier';
export const APP_DESCRIPTION = 'Modern HRMS for indian businesses';


export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    EMPLOYEES: '/employees',
    ATTENDANCE: '/attendance',
    LEAVES: '/leaves',
    DEPARTMENTS: '/departments',
    SETTINGS: '/settings',
} as const;


export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    HR_MANAGER: 'HR_MANAGER',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE',
} as const;
export const EMPLOYEE_STATUS = {
    ACTIVE: 'ACTIVE',
    ON_NOTICE: 'ON_NOTICE',
    TERMINATED: 'TERMINATED',
    ON_LEAVE: 'ON_LEAVE',
} as const;
 export const LEAVE_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
  } as const;
export const ATTENDANCE_STATUS = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    HALF_DAY: 'HALF_DAY',
    LATE: 'LATE',
    ON_LEAVE: 'ON_LEAVE',
} as const;