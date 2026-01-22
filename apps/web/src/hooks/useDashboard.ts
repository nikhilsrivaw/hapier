
  'use client';

  import { useState, useEffect, useCallback } from 'react';
  import { DashboardStats } from '@/types';
  import { organizationService } from '@/services/organization.service';

  export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await organizationService.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard stats');
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchStats();
    }, [fetchStats]);

    return {
      stats,
      isLoading,
      error,
      refetch: fetchStats,
    };
  }