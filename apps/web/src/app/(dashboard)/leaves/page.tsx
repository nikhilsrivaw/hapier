 'use client';

  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { format, differenceInDays } from 'date-fns';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import { useAuth } from '@/hooks/useAuth';
  import { useLeaves } from '@/hooks/useLeaves';
  import { leaveService } from '@/services/leave.service';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
  import { LoadingSpinner, ErrorMessage } from '@/components/common';
  import {
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    RefreshCw,
    FileText,
  } from 'lucide-react';

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-700',
  };

  export default function LeavesPage() {
    const { user } = useAuth();
    const { leaveRequests, leaveTypes, isLoading, error, refetch } = useLeaves();
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
      leaveTypeId: '',
      startDate: '',
      endDate: '',
      reason: '',
    });

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR_MANAGER';

    const filteredRequests = (filterStatus === 'all'
      ? leaveRequests
      : leaveRequests.filter((r) => r.status === filterStatus)
    ).filter((r) => r.employee);

    const stats = {
      total: leaveRequests.length,
      pending: leaveRequests.filter((r) => r.status === 'PENDING').length,
      approved: leaveRequests.filter((r) => r.status === 'APPROVED').length,
      rejected: leaveRequests.filter((r) => r.status === 'REJECTED').length,
    };

    const handleCreateRequest = async () => {
      if (!user?.employeeId) {
        setFormError('Employee ID not found');
        return;
      }
      if (!formData.leaveTypeId || !formData.startDate || !formData.endDate || !formData.reason) {   
        setFormError('Please fill all fields');
        return;
      }

      setIsSubmitting(true);
      setFormError('');

      try {
        await leaveService.createRequest({
          employeeId: user.employeeId,
          leaveTypeId: formData.leaveTypeId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
        });
        setIsDialogOpen(false);
        setFormData({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
        refetch();
      } catch (err: any) {
        setFormError(err.message || 'Failed to create request');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleUpdateStatus = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {       
      try {
        await leaveService.updateStatus(requestId, status);
        refetch();
      } catch (err: any) {
        alert(err.message || 'Failed to update status');
      }
    };

    const handleCancelRequest = async (requestId: string) => {
      if (!confirm('Are you sure you want to cancel this request?')) return;
      try {
        await leaveService.cancelRequest(requestId);
        refetch();
      } catch (err: any) {
        alert(err.message || 'Failed to cancel request');
      }
    };

    const formatDate = (dateString: string) => {
      return format(new Date(dateString), 'MMM d, yyyy');
    };

    const getDuration = (start: string, end: string) => {
      const days = differenceInDays(new Date(end), new Date(start)) + 1;
      return `${days} day${days > 1 ? 's' : ''}`;
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
                Leave Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage leave requests and approvals
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-rose-600 hover:bg-rose-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Request Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Leave Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {formError && (
                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{formError}</p>        
                  )}
                  <div className="space-y-2">
                    <Label>Leave Type *</Label>
                    <Select
                      value={formData.leaveTypeId}
                      onValueChange={(v) => setFormData({ ...formData, leaveTypeId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.daysAllowed} days)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}    
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}      
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reason *</Label>
                    <Textarea
                      placeholder="Enter reason for leave"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateRequest}
                      disabled={isSubmitting}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      {isSubmitting ? <LoadingSpinner size="sm" /> : 'Submit Request'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-50">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-50">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leave Requests Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Leave Requests</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={refetch}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <ErrorMessage message={error} onRetry={refetch} />
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No leave requests found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {request.employee?.firstName} {request.employee?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {request.employee?.employeeCode}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{request.leaveType?.name || '-'}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {getDuration(request.startDate, request.endDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(request.startDate)} - {formatDate(request.endDate)}      
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {request.reason}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[request.status]}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === 'PENDING' && (
                              <div className="flex gap-2">
                                {isAdmin && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() => handleUpdateStatus(request.id, 'APPROVED')}     
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleUpdateStatus(request.id, 'REJECTED')}     
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                {request.employeeId === user?.employeeId && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCancelRequest(request.id)}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }
