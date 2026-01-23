'use client';

  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { motion } from 'framer-motion';
  import { useAuthStore } from '@/store/auth';
  import { ROUTES } from '@/config/constants';
  import { PageLoader } from '@/components/common';
  import Navbar from './Navbar';
  import Sidebar from './Sidebar';

  interface DashboardLayoutProps {
    children: React.ReactNode;
  }

  export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const { user, isLoading, checkAuth } = useAuthStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
      if (!hasCheckedAuth) {
        checkAuth();
        setHasCheckedAuth(true);
      }
    }, [checkAuth, hasCheckedAuth]);

    useEffect(() => {
      if (hasCheckedAuth && !isLoading && !user) {
        router.push(ROUTES.LOGIN);
      }
    }, [hasCheckedAuth, isLoading, user, router]);

    // Show loader only on initial load
    if (!hasCheckedAuth || isLoading) {
      return <PageLoader />;
    }

    if (!user) {
      return null;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        {/* Main Content */}
        <motion.main
          animate={{ marginLeft: sidebarCollapsed ? 80 : 256 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="pt-16 min-h-screen hidden lg:block"
        >
          <div className="p-6">{children}</div>
        </motion.main>

        {/* Mobile Main Content */}
        <main className="pt-16 min-h-screen lg:hidden">
          <div className="p-4">{children}</div>
        </main>
      </div>
    );
  }
