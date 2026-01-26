  'use client';

  import { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import { useAuth } from '@/hooks/useAuth';
  import { useDepartments } from '@/hooks/useDepartments';
  import { useEmployees } from '@/hooks/useEmployees';
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';  
  import { Button } from '@/components/ui/button';
   import AIReportGenerator from '@/components/reports/AIReportGenrator';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { LoadingSpinner } from '@/components/common';
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
  } from 'recharts';
  import {
    Users,
    Building2,
    TrendingUp,
    Download,
    FileText,
    CalendarDays,
    UserCheck,
    UserX,
  } from 'lucide-react';

  const COLORS = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6366f1'];

  export default function ReportsPage() {
    const { organization } = useAuth();
    const { departments, isLoading: deptLoading } = useDepartments();
    const { employees, isLoading: empLoading } = useEmployees();
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const isLoading = deptLoading || empLoading;

    // Calculate department distribution
    const departmentData = departments.map((dept) => ({
      name: dept.name,
      employees: dept._count?.employees || 0,
    })).filter((d) => d.employees > 0);

    // Calculate employee status distribution
    const statusData = [
      {
        name: 'Active',
        value: employees.filter((e) => e.status === 'ACTIVE').length,
      },
      {
        name: 'On Leave',
        value: employees.filter((e) => e.status === 'ON_LEAVE').length,
      },
      {
        name: 'On Notice',
        value: employees.filter((e) => e.status === 'ON_NOTICE').length,
      },
      {
        name: 'Terminated',
        value: employees.filter((e) => e.status === 'TERMINATED').length,
      },
    ].filter((d) => d.value > 0);

    // Calculate gender distribution
    const genderData = [
      {
        name: 'Male',
        value: employees.filter((e) => e.gender === 'MALE').length,
      },
      {
        name: 'Female',
        value: employees.filter((e) => e.gender === 'FEMALE').length,
      },
      {
        name: 'Other',
        value: employees.filter((e) => e.gender === 'OTHER').length,
      },
    ].filter((d) => d.value > 0);

    // Stats
    const stats = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter((e) => e.status === 'ACTIVE').length,
      totalDepartments: departments.length,
      avgPerDept: departments.length > 0
        ? Math.round(employees.length / departments.length)
        : 0,
    };

    const handleExportCSV = () => {
      // Create CSV content
      const headers = ['Employee Code', 'Name', 'Email', 'Department', 'Designation', 'Status','Joining Date'];
      const rows = employees.map((emp) => [
        emp.employeeCode,
        `${emp.firstName} ${emp.lastName}`,
        emp.email,
        emp.department?.name || '',
        emp.designation,
        emp.status,
        new Date(emp.joiningDate).toLocaleDateString(),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `employees_report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    };

    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Reports & Analytics
              </h1>
              <p className="text-gray-500 mt-1">
                Insights and statistics for {organization?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-50">
                        <Users className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Employees</p>
                        <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-50">
                        <UserCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Active Employees</p>
                        <p className="text-2xl font-bold">{stats.activeEmployees}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-violet-50">
                        <Building2 className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Departments</p>
                        <p className="text-2xl font-bold">{stats.totalDepartments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg per Dept</p>
                        <p className="text-2xl font-bold">{stats.avgPerDept}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <AIReportGenerator />

              {/* Charts Row 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Department Distribution */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Employees by Department</CardTitle>
                    <CardDescription>Distribution across departments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {departmentData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="employees" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">     
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Employee Status */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Employee Status</CardTitle>
                    <CardDescription>Current status distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {statusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}  
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />    
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">     
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Charts Row 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Gender Distribution */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Gender Distribution</CardTitle>
                    <CardDescription>Employee gender breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {genderData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}  
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />    
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-gray-500">     
                        No data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Quick Statistics</CardTitle>
                    <CardDescription>Key metrics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">  
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-600">Total Headcount</span>
                        </div>
                        <span className="font-bold text-lg">{stats.totalEmployees}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">  
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-5 h-5 text-green-500" />
                          <span className="text-gray-600">Active Rate</span>
                        </div>
                        <span className="font-bold text-lg text-green-600">
                          {stats.totalEmployees > 0
                            ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100)       
                            : 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">  
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-violet-500" />
                          <span className="text-gray-600">Largest Department</span>
                        </div>
                        <span className="font-bold text-lg">
                          {departmentData.length > 0
                            ? departmentData.reduce((a, b) => a.employees > b.employees ? a : b).name

                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">  
                        <div className="flex items-center gap-3">
                          <CalendarDays className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-600">Report Generated</span>
                        </div>
                        <span className="font-bold text-lg">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </DashboardLayout>
    );
  }
