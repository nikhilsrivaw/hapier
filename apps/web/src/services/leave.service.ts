import api from '@/lib/api';
  import { LeaveRequest, LeaveType, CreateLeaveTypeData } from '@/types';

  export const leaveService = {
    // Get all leave types
    async getLeaveTypes(): Promise<LeaveType[]> {
      return api.get<LeaveType[]>('/leave/types');
    },

    // Create leave type (Admin/HR)
    async createLeaveType(data: CreateLeaveTypeData): Promise<LeaveType> {
      return api.post<LeaveType>('/leave/types', data);
    },

    // Create leave request
    async createRequest(data: {
      employeeId: string;
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      reason: string;
    }): Promise<LeaveRequest> {
      return api.post<LeaveRequest>('/leave/request', data);
    },

    // Get my leave requests
    async getMyRequests(employeeId: string): Promise<LeaveRequest[]> {
      return api.get<LeaveRequest[]>(`/leave/my-requests/${employeeId}`);
    },

    // Get all pending requests (Admin/HR)
    async getPendingRequests(): Promise<LeaveRequest[]> {
      return api.get<LeaveRequest[]>('/leave/pending');
    },

    // Get all requests (Admin/HR)
    async getAllRequests(status?: string): Promise<LeaveRequest[]> {
      return api.get<LeaveRequest[]>('/leave/all', { status });
    },

    // Approve or reject (Admin/HR)
    async updateStatus(requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<LeaveRequest> {  
      return api.patch<LeaveRequest>(`/leave/${requestId}/status`, { status });
    },

    // Cancel request (Employee)
    async cancelRequest(requestId: string): Promise<LeaveRequest> {
      return api.post<LeaveRequest>(`/leave/${requestId}/cancel`);
    },
  };