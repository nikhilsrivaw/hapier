
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
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  assigneeId?: string;
  creatorId: string;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  projectId?: string;
  project?: {
    id: string;
    name: string;
  };
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
  createdAt: string;
  updatedAt: string;
}
export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Auth types
export interface User {
  id: string;
  email: string;
  role: Role;
  employeeId: string | null;
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

// ==================== RECRUITMENT TYPES ====================                                        
  
  export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
  export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
  export type JobStatus = 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED' | 'FILLED';
  export type CandidateSource = 'DIRECT' | 'LINKEDIN' | 'REFERRAL' | 'JOB_BOARD' | 'AGENCY' |
  'CAREER_PAGE' | 'OTHER';
  export type ApplicationStage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED' 
  | 'WITHDRAWN';
  export type InterviewType = 'PHONE' | 'VIDEO' | 'IN_PERSON' | 'TECHNICAL' | 'HR' | 'FINAL';
  export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';    

  export interface Job {
      id: string;
      title: string;
      description?: string;
      requirements?: string;
      responsibilities?: string;
      location?: string;
      jobType: JobType;
      experienceLevel: ExperienceLevel;
      salaryMin?: number;
      salaryMax?: number;
      status: JobStatus;
      departmentId?: string;
      department?: Department;
      organizationId: string;
      applications?: Application[];
      interviews?: Interview[];
      _count?: { applications: number };
      createdAt: string;
      updatedAt: string;
      closedAt?: string;
  }

  export interface Candidate {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      resumeText?: string;
      resumeUrl?: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      currentCompany?: string;
      currentRole?: string;
      experience?: number;
      skills: string[];
      source: CandidateSource;
      organizationId: string;
      applications?: Application[];
      interviews?: Interview[];
      notes?: CandidateNote[];
      _count?: { interviews: number; notes: number };
      createdAt: string;
      updatedAt: string;
  }

  export interface Application {
      id: string;
      candidateId: string;
      candidate?: Candidate;
      jobId: string;
      job?: Job;
      stage: ApplicationStage;
      rating?: number;
      organizationId: string;
      appliedAt: string;
      updatedAt: string;
      hiredAt?: string;
      rejectedAt?: string;
      rejectionReason?: string;
  }

  export interface Interview {
      id: string;
      candidateId: string;
      candidate?: Candidate;
      jobId: string;
      job?: Job;
      interviewerId: string;
      interviewer?: Employee;
      scheduledAt: string;
      duration: number;
      type: InterviewType;
      location?: string;
      status: InterviewStatus;
      feedback?: string;
      rating?: number;
      organizationId: string;
      createdAt: string;
      updatedAt: string;
  }

  export interface CandidateNote {
      id: string;
      candidateId: string;
      authorId: string;
      author?: Employee;
      content: string;
      organizationId: string;
      createdAt: string;
  }

  export interface RecruitmentAnalytics {
      overview: {
          totalJobs: number;
          openJobs: number;
          totalCandidates: number;
          totalApplications: number;
          recentHires: number;
          avgTimeToHire: number;
      };
      pipeline: Record<ApplicationStage, number>;
      sources: Record<CandidateSource, number>;
  }


