 'use client';                                                                                         
  import { motion } from 'framer-motion';                                                            
  import Link from 'next/link';
  import { useAuth, useDashboard } from '@/hooks';
  import { useTasks } from '@/hooks/useTasks';
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
      CheckSquare,
      AlertCircle,
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
      const { organization, user } = useAuth();
      const { stats, isLoading, error, refetch } = useDashboard();
      const { tasks } = useTasks();

      // Filter my tasks
      const myTasks = tasks.filter((task) => task.assigneeId === user?.employeeId);
      const pendingTasks = myTasks.filter((task) => task.status !== 'DONE');
      const overdueTasks = myTasks.filter((task) => {
          if (!task.dueDate || task.status === 'DONE') return false;
          return new Date(task.dueDate) < new Date();
      });

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
          { title: 'Add Employee', icon: UserPlus, href: '/employees/new', color: 'from-rose-500  to-orange-500' },
          { title: 'View Attendance', icon: CalendarCheck, href: ROUTES.ATTENDANCE, color:
  'from-teal-500 to-emerald-500' },
          { title: 'Leave Requests', icon: FileText, href: ROUTES.LEAVES, color: 'from-amber-500 to-orange-500' },
          { title: 'Reports', icon: TrendingUp, href: '/reports', color: 'from-violet-50 to-purple-500' },
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
                                      <Card className="border-0 shadow-lg hover:shadow-xl
  transition-shadow cursor-pointer group">
                                          <CardHeader className="flex flex-row items-center
  justify-between pb-2">
                                              <CardTitle className="text-sm font-medium
  text-gray-600">
                                                  {stat.title}
                                              </CardTitle>
                                              <div className={`p-2 rounded-xl ${colors.light}        
  group-hover:scale-110 transition-transform`}>
                                                  <stat.icon className={`h-5 w-5 ${colors.text}`} /> 
                                              </div>
                                          </CardHeader>
                                          <CardContent>
                                              {isLoading ? (
                                                  <LoadingSpinner size="sm" />
                                              ) : (
                                                  <>
                                                      <p className="text-3xl font-bold
  text-gray-900">{stat.value}</p>
                                                      <p className="text-sm text-gray-500
  mt-1">{stat.subtitle}</p>
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
                                      <Card className="border-0 shadow-lg hover:shadow-xl
  transition-all cursor-pointer group h-full">
                                          <CardContent className="p-5">
                                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform   
  shadow-lg`}>
                                                  <action.icon className="h-6 w-6 text-white" />     
                                              </div>
                                              <h3 className="font-semibold text-gray-900
  group-hover:text-rose-600 transition-colors flex items-center gap-2">
                                                  {action.title}
                                                  <ArrowRight className="w-4 h-4 opacity-0
  -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                              </h3>
                                          </CardContent>
                                      </Card>
                                  </Link>
                              </motion.div>
                          ))}
                      </div>
                  </motion.div>

                  {/* My Tasks Widget */}
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                  >
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
                          <Link href="/tasks">
                              <Button variant="ghost" size="sm" className="gap-2">
                                  View All
                                  <ArrowRight className="w-4 h-4" />
                              </Button>
                          </Link>
                      </div>

                      <Card className="border-0 shadow-lg">
                          <CardContent className="p-6">
                              {pendingTasks.length === 0 ? (
                                  <div className="text-center py-8 text-gray-500">
                                      <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300"  
  />
                                      <p>No pending tasks</p>
                                  </div>
                              ) : (
                                  <div className="space-y-3">
                                      {pendingTasks.slice(0, 5).map((task) => {
                                          const isOverdue = task.dueDate && new Date(task.dueDate) < 
  new Date();
                                          return (
                                              <Link key={task.id} href="/tasks">
                                                  <div className="flex items-center justify-between  
  p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                                      <div className="flex items-center gap-3">      
                                                          <div className={`w-2 h-2 rounded-full ${   
                                                              task.priority === 'URGENT' ?
  'bg-red-500' :
                                                              task.priority === 'HIGH' ?
  'bg-orange-500' :
                                                              task.priority === 'MEDIUM' ?
  'bg-blue-500' :
                                                              'bg-gray-400'
                                                          }`} />
                                                          <div>
                                                              <p className="font-medium text-gray-900
   group-hover:text-rose-600 transition-colors">
                                                                  {task.title}
                                                              </p>
                                                              <p className="text-sm text-gray-500">  
                                                                  {task.status.replace('_', ' ')}    
                                                              </p>
                                                          </div>
                                                      </div>
                                                      <div className="flex items-center gap-2">      
                                                          {isOverdue && (
                                                              <span className="flex items-center     
  gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                                                  <AlertCircle className="w-3 h-3" />
                                                                  Overdue
                                                              </span>
                                                          )}
                                                          {task.dueDate && !isOverdue && (
                                                              <span className="text-xs
  text-gray-500">
                                                                  {new
  Date(task.dueDate).toLocaleDateString()}
                                                              </span>
                                                          )}
                                                      </div>
                                                  </div>
                                              </Link>
                                          );
                                      })}

                                      {pendingTasks.length > 5 && (
                                          <p className="text-sm text-gray-500 text-center pt-2">     
                                              +{pendingTasks.length - 5} more tasks
                                          </p>
                                      )}
                                  </div>
                              )}
                          </CardContent>
                      </Card>
                  </motion.div>
              </div>
          </DashboardLayout>
      );
  }