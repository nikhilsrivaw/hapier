'use client';

  import { motion } from 'framer-motion';
  import Link from 'next/link';
  import { useAuth, useDashboard } from '@/hooks';
  import { ROUTES } from '@/config/constants';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { LoadingSpinner, ErrorMessage } from '@/components/common';
  import {
    Users,
    Building2,
    CalendarCheck,
    Clock,
    UserPlus,
    FileText,
    TrendingUp,
    ArrowRight,
  } from 'lucide-react';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  export default function DashboardPage() {
    const { organization } = useAuth();
    const { stats, isLoading, error, refetch } = useDashboard();

    const statCards = [
      {
        title: 'Total Employees',
        value: stats?.totalEmployees || 0,
        subtitle: `${stats?.activeEmployees || 0} active`,
        icon: Users,
        color: 'rose',
        href: ROUTES.EMPLOYEES,
      },
      {
        title: 'Departments',
        value: stats?.departments || 0,
        subtitle: 'across organization',
        icon: Building2,
        color: 'violet',
        href: ROUTES.DEPARTMENTS,
      },
      {
        title: "Today's Attendance",
        value: stats?.todayAttendance || 0,
        subtitle: `${stats?.attendancePercentage || 0}% present`,
        icon: CalendarCheck,
        color: 'teal',
        href: ROUTES.ATTENDANCE,
      },
      {
        title: 'Pending Leaves',
        value: stats?.pendingLeaves || 0,
        subtitle: 'awaiting approval',
        icon: Clock,
        color: 'amber',
        href: ROUTES.LEAVES,
      },
    ];

    const colorMap: Record<string, { bg: string; text: string; light: string }> = {
      rose: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50' },
      violet: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
      teal: { bg: 'bg-teal-500', text: 'text-teal-600', light: 'bg-teal-50' },
      amber: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50' },
    };

    const quickActions = [
      { title: 'Add Employee', icon: UserPlus, href: '/employees/new', color: 'from-rose-500 to-orange-500' },
      { title: 'View Attendance', icon: CalendarCheck, href: ROUTES.ATTENDANCE, color: 'from-teal-500 to-emerald-500' },
      { title: 'Leave Requests', icon: FileText, href: ROUTES.LEAVES, color: 'from-amber-500 to-orange-500' },
      { title: 'Reports', icon: TrendingUp, href: '/reports', color: 'from-violet-500 to-purple-500' 
  },
    ];

    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back! 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Here's what's happening at {organization?.name}
              </p>
            </div>
            <Button className="bg-gray-900 hover:bg-gray-800">
              Download Report
            </Button>
          </motion.div>

          {/* Error State */}
          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {/* Stats Cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {statCards.map((stat) => {
              const colors = colorMap[stat.color];
              return (
                <motion.div key={stat.title} variants={item}>
                  <Link href={stat.href}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow
  cursor-pointer group">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">       
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-xl ${colors.light} group-hover:scale-110        
  transition-transform`}>
                          <stat.icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link href={action.href}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer
   group h-full">
                      <CardContent className="p-5">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex  
  items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-rose-600
  transition-colors flex items-center gap-2">
                          {action.title}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2
  group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }
