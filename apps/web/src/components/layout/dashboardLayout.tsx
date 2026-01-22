 'use client';

  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { useAuth } from '@/hooks/useAuth';
  import { PageLoader } from '@/components/common';
  import Navbar from './Navbar';
  import Sidebar from './Sidebar';

  interface DashboardLayoutProps {
    children: React.ReactNode;
  }

  export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isLoading, isAuthenticated } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    if (isLoading) {
      return <PageLoader />;
    }

    if (!isAuthenticated) {
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