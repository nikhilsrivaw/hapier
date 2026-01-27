'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Clock,
  Building2,
  CheckSquare,
  FolderKanban,
  Settings,
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';

const menuItems = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard, color: 'rose' },
  { name: 'Employees', href: ROUTES.EMPLOYEES, icon: Users, color: 'blue' },
  { name: 'Attendance', href: ROUTES.ATTENDANCE, icon: CalendarCheck, color: 'teal' },
  { name: 'Leaves', href: ROUTES.LEAVES, icon: Clock, color: 'amber' },
  { name: 'Departments', href: ROUTES.DEPARTMENTS, icon: Building2, color: 'violet' },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings, color: 'gray' },
  { name: 'Tasks', href: ROUTES.TASKS, icon: CheckSquare, color: 'emerald' },
  { name: 'Projects', href: ROUTES.PROJECTS, icon: FolderKanban, color: 'cyan' },
 { name: 'Recruitment', href: ROUTES.RECRUITMENT, icon: Briefcase, color: 'violet' },

];

const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', hover: 'hover:bg-rose-50' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', hover: 'hover:bg-teal-50' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'hover:bg-amber-50' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', hover: 'hover:bg-violet-50' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:bg-emerald-50' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hover: 'hover:bg-cyan-50' },
};

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40"
    >
      <div className="flex flex-col h-full p-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5    
  shadow-md hover:shadow-lg transition-shadow"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </motion.div>
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const colors = colorMap[item.color];

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer',
                    isActive
                      ? `${colors.bg} ${colors.text}`
                      : `text-gray-600 ${colors.hover}`
                  )}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && colors.text)} />

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className={cn(
                        'absolute left-0 w-1 h-8 rounded-r-full',
                        colors.text.replace('text-', 'bg-')
                      )}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}