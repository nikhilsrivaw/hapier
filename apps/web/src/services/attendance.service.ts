
  import api from '@/lib/api';
  import { Attendance, MarkAttendanceData } from '@/types';

  export const attendanceService = {
    async checkIn(employeeId: string): Promise<Attendance> {
      return api.post<Attendance>('/attendance/check-in', { employeeId });
    },

    async checkOut(employeeId: string): Promise<Attendance> {
      return api.post<Attendance>('/attendance/check-out', { employeeId });
    },

    async getToday(): Promise<Attendance[]> {
      return api.get<Attendance[]>('/attendance/today');
    },

    async getByEmployee(employeeId: string, month?: number, year?: number): 
  Promise<Attendance[]> {
      return api.get<Attendance[]>(`/attendance/employee/${employeeId}`, { month, year });     
    },

    async markAttendance(data: MarkAttendanceData): Promise<Attendance> {
      return api.post<Attendance>('/attendance/mark', data);
    },
  };