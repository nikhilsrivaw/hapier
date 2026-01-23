 'use client';

  import { useState, useEffect, useCallback } from 'react';
  import { LeaveRequest, LeaveType } from '@/types';
  import { leaveService } from '@/services/leave.service';

  export function useLeaves(employeeId?: string | null) {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeaveRequests = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const requests = await leaveService.getAllRequests();
        setLeaveRequests(requests);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leave requests');
      } finally {
        setIsLoading(false);
      }
    }, []);

    const fetchLeaveTypes = useCallback(async () => {
      try {
        const types = await leaveService.getLeaveTypes();
        setLeaveTypes(types);
      } catch (err: any) {
        console.error('Failed to fetch leave types:', err);
      }
    }, []);

    useEffect(() => {
      fetchLeaveRequests();
      fetchLeaveTypes();
    }, [fetchLeaveRequests, fetchLeaveTypes]);

    return {
      leaveRequests,
      leaveTypes,
      isLoading,
      error,
      refetch: fetchLeaveRequests,
      refetchTypes: fetchLeaveTypes,
    };
  }
