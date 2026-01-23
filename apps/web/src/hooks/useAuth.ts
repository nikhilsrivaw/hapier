 'use client';

  import { useEffect, useRef } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAuthStore } from '@/store/auth';
  import { ROUTES } from '@/config/constants';

  export function useAuth(requireAuth = true) {
    const router = useRouter();
    const { user, organization, isLoading, isAuthenticated, checkAuth, logout } = useAuthStore();    
    const hasChecked = useRef(false);

    useEffect(() => {
      if (!hasChecked.current) {
        checkAuth();
        hasChecked.current = true;
      }
    }, [checkAuth]);

    useEffect(() => {
      if (!isLoading && requireAuth && !isAuthenticated) {
        router.push(ROUTES.LOGIN);
      }
    }, [isLoading, isAuthenticated, requireAuth, router]);

    return {
      user,
      organization,
      isLoading,
      isAuthenticated,
      logout,
    };
  }