'use client';                                                                                      

  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { useRouter } from 'next/navigation';
  import { useEmployees, useDepartments } from '@/hooks';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Badge } from '@/components/ui/badge';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/common';
  import { employeeService } from '@/services/employee.service';
  import { Employee } from '@/types';
  import { EMPLOYEE_STATUS } from '@/config/constants';
  import {
    Plus,
    Search,
    Users,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
  } from 'lucide-react';
  import { format } from 'date-fns';

  const statusColors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: 'bg-teal-50', text: 'text-teal-700' },
    ON_NOTICE: { bg: 'bg-amber-50', text: 'text-amber-700' },
    TERMINATED: { bg: 'bg-red-50', text: 'text-red-700' },
    ON_LEAVE: { bg: 'bg-blue-50', text: 'text-blue-700' },
  };

  export default function EmployeesPage() {
    const router = useRouter();
    const { employees, isLoading, error, refetch } = useEmployees();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; employee: Employee | null }>({   
      open: false,
      employee: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredEmployees = employees.filter((emp) => {
      const query = searchQuery.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.employeeCode.toLowerCase().includes(query) ||
        emp.designation.toLowerCase().includes(query)
      );
    });

    const handleDelete = async () => {
      if (!deleteModal.employee) return;

      setIsDeleting(true);
      try {
        await employeeService.delete(deleteModal.employee.id);
        setDeleteModal({ open: false, employee: null });
        refetch();
      } catch (err: any) {
        console.error('Delete failed:', err.message);
      } finally {
        setIsDeleting(false);
      }
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employees</h1>
              <p className="text-gray-500 mt-1">Manage your team members</p>
            </div>
            <Button
              onClick={() => router.push('/employees/new')}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
  text-gray-400" />
                    <Input
                      placeholder="Search by name, email, code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-600" />
                  All Employees
                  <Badge variant="secondary" className="ml-2">
                    {filteredEmployees.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="py-12">
                    <ErrorMessage message={error} onRetry={refetch} />
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No employees found"
                    description={
                      searchQuery
                        ? 'Try adjusting your search query'
                        : 'Get started by adding your first employee'
                    }
                    actionLabel={!searchQuery ? 'Add Employee' : undefined}
                    onAction={!searchQuery ? () => router.push('/employees/new') : undefined}        
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead className="hidden md:table-cell">Department</TableHead>
                          <TableHead className="hidden lg:table-cell">Designation</TableHead>        
                          <TableHead className="hidden lg:table-cell">Joined</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-rose-500
  to-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                                  {employee.firstName[0]}
                                  {employee.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {employee.firstName} {employee.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">{employee.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {employee.employeeCode}
                              </code>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {employee.department?.name || '-'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {employee.designation}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {format(new Date(employee.joiningDate), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${statusColors[employee.status]?.bg}
  ${statusColors[employee.status]?.text} border-0`}
                              >
                                {employee.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0
  group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/employees/${employee.id}`)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/employees/${employee.id}/edit`)}      
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"        
                                  onClick={() => setDeleteModal({ open: true, employee })}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, employee: null
   })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-semibold">
                  {deleteModal.employee?.firstName} {deleteModal.employee?.lastName}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ open: false, employee: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    );
  }