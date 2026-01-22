 import api from '@/lib/api';
  import { LeaveRequest, LeaveType, CreateLeaveRequestData, CreateLeaveTypeData } from
  '@/types';

  export const leaveService = {
    // Leave Types
    async getLeaveTypes(): Promise<LeaveType[]> {
      return api.get<LeaveType[]>('/leave/types');
    },

    async createLeaveType(data: CreateLeaveTypeData): Promise<LeaveType> {
      return api.post<LeaveType>('/leave/types', data);
    },

    // Leave Requests
    async createRequest(data: CreateLeaveRequestData): Promise<LeaveRequest> {
      return api.post<LeaveRequest>('/leave/request', data);
    },

    async getMyRequests(employeeId: string): Promise<LeaveRequest[]> {
      return api.get<LeaveRequest[]>(`/leave/my-requests/${employeeId}`);
    },

    async getPendingRequests(): Promise<LeaveRequest[]> {
      return api.get<LeaveRequest[]>('/leave/pending');
    },

    async getAllRequests(status?: string): Promise<LeaveRequest[]> {
      return api.get<LeaveRequest[]>('/leave/all', { status });
    },

    async updateStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<LeaveRequest> {   
      return api.patch<LeaveRequest>(`/leave/${id}/status`, { status });
    },

    async cancelRequest(id: string, employeeId: string): Promise<LeaveRequest> {
      return api.post<LeaveRequest>(`/leave/${id}/cancel`, { employeeId });
    },
  };