 'use client';

  import { useState, useEffect, useCallback } from 'react';
  import { Attendance } from '@/types';
  import { attendanceService } from '@/services/attendance.service';

  export function useAttendance() {
    const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTodayAttendance = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await attendanceService.getToday();
        setTodayAttendance(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch attendance');
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchTodayAttendance();
    }, [fetchTodayAttendance]);

    return {
      todayAttendance,
      isLoading,
      error,
      refetch: fetchTodayAttendance,
    };
  }