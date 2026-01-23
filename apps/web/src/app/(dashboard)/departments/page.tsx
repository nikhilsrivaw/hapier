
  'use client';

  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import { useAuth } from '@/hooks/useAuth';
  import { useDepartments } from '@/hooks/useDepartments';
  import { departmentService } from '@/services/department.service';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
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
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  import { LoadingSpinner, ErrorMessage } from '@/components/common';
  import {
    Building2,
    Plus,
    Pencil,
    Trash2,
    Users,
    RefreshCw,
  } from 'lucide-react';

  export default function DepartmentsPage() {
    const { user } = useAuth();
    const { departments, isLoading, error, refetch } = useDepartments();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<{ id: string; name: string } |      
  null>(null);
    const [departmentName, setDepartmentName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

    const totalEmployees = departments.reduce((sum, dept) => sum + (dept._count?.employees || 0), 0);

    const handleOpenCreate = () => {
      setSelectedDepartment(null);
      setDepartmentName('');
      setFormError('');
      setIsDialogOpen(true);
    };

    const handleOpenEdit = (dept: { id: string; name: string }) => {
      setSelectedDepartment(dept);
      setDepartmentName(dept.name);
      setFormError('');
      setIsDialogOpen(true);
    };

    const handleOpenDelete = (dept: { id: string; name: string }) => {
      setSelectedDepartment(dept);
      setIsDeleteDialogOpen(true);
    };

    const handleSubmit = async () => {
      if (!departmentName.trim()) {
        setFormError('Department name is required');
        return;
      }

      setIsSubmitting(true);
      setFormError('');

      try {
        if (selectedDepartment) {
          await departmentService.update(selectedDepartment.id, { name: departmentName });
        } else {
          await departmentService.create({ name: departmentName });
        }
        setIsDialogOpen(false);
        setDepartmentName('');
        setSelectedDepartment(null);
        refetch();
      } catch (err: any) {
        setFormError(err.message || 'Operation failed');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleDelete = async () => {
      if (!selectedDepartment) return;

      try {
        await departmentService.delete(selectedDepartment.id);
        setIsDeleteDialogOpen(false);
        setSelectedDepartment(null);
        refetch();
      } catch (err: any) {
        alert(err.message || 'Failed to delete department');
        setIsDeleteDialogOpen(false);
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Departments
              </h1>
              <p className="text-gray-500 mt-1">
                Manage organization departments
              </p>
            </div>
            {isAdmin && (
              <Button onClick={handleOpenCreate} className="bg-rose-600 hover:bg-rose-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            )}
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-50">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Departments</p>
                    <p className="text-2xl font-bold">{departments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Employees</p>
                    <p className="text-2xl font-bold">{totalEmployees}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Departments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Departments</CardTitle>
                <Button variant="outline" size="icon" onClick={refetch}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <ErrorMessage message={error} onRetry={refetch} />
                ) : departments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No departments found. Create your first department.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department Name</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Created</TableHead>
                        {isAdmin && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departments.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-violet-50">
                                <Building2 className="w-4 h-4 text-violet-600" />
                              </div>
                              <span className="font-medium">{dept.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              {dept._count?.employees || 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500">
                            {new Date(dept.createdAt).toLocaleDateString()}
                          </TableCell>
                          {isAdmin && (
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenEdit({ id: dept.id, name: dept.name })}   
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleOpenDelete({ id: dept.id, name: dept.name })} 
                                  disabled={(dept._count?.employees || 0) > 0}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Create/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedDepartment ? 'Edit Department' : 'Create Department'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {formError && (
                  <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{formError}</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Engineering, Marketing, Sales"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : selectedDepartment ? (
                      'Update'
                    ) : (
                      'Create'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Department</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{selectedDepartment?.name}"? This action cannot be
   undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    );
  }
