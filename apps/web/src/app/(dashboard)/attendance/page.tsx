'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layout/dashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAttendance } from '@/hooks/useAttendance';
import { attendanceService } from '@/services/attendance.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner, ErrorMessage } from '@/components/common';
import {
    CalendarCheck,
    Clock,
    LogIn,
    LogOut,
    Users,
    RefreshCw,
} from 'lucide-react';

const statusColors: Record<string, string> = {
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    HALF_DAY: 'bg-yellow-100 text-yellow-700',
    LATE: 'bg-orange-100 text-orange-700',
    ON_LEAVE: 'bg-blue-100 text-blue-700',
};

export default function AttendancePage() {
    const { user } = useAuth();
    const { todayAttendance, isLoading, error, refetch } = useAttendance();
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isMarking, setIsMarking] = useState(false);

    const filteredAttendance = filterStatus === 'all'
        ? todayAttendance
        : todayAttendance.filter((a) => a.status === filterStatus);

    const stats = {
        total: todayAttendance.length,
        present: todayAttendance.filter((a) => a.status === 'PRESENT').length,
        absent: todayAttendance.filter((a) => a.status === 'ABSENT').length,
        late: todayAttendance.filter((a) => a.status === 'LATE').length,
    };

    const handleCheckIn = async () => {
        if (!user?.employeeId) {
            alert('Employee ID not found');
            return;
        }
        setIsMarking(true);
        try {
            await attendanceService.checkIn(user.employeeId);
            refetch();
        } catch (err: any) {
            alert(err.message || 'Check-in failed');
        } finally {
            setIsMarking(false);
        }
    };

    const handleCheckOut = async () => {
        if (!user?.employeeId) {
            alert('Employee ID not found');
            return;
        }
        setIsMarking(true);
        try {
            await attendanceService.checkOut(user.employeeId);
            refetch();
        } catch (err: any) {
            alert(err.message || 'Check-out failed');
        } finally {
            setIsMarking(false);
        }
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'hh:mm a');
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
                            Attendance
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {format(new Date(), 'EEEE, MMMM d, yyyy')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleCheckIn}
                            disabled={isMarking}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Check In
                        </Button>
                        <Button
                            onClick={handleCheckOut}
                            disabled={isMarking}
                            variant="outline"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Check Out
                        </Button>
                    </div>
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
                                    <Users className="w-5 h-5 text-blue-600" />
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
                                <div className="p-2 rounded-lg bg-green-50">
                                    <CalendarCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Present</p>
                                    <p className="text-2xl font-bold">{stats.present}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-50">
                                    <Clock className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Absent</p>
                                    <p className="text-2xl font-bold">{stats.absent}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-50">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Late</p>
                                    <p className="text-2xl font-bold">{stats.late}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Attendance Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Today's Attendance</CardTitle>
                            <div className="flex items-center gap-2">
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Filter status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="PRESENT">Present</SelectItem>
                                        <SelectItem value="ABSENT">Absent</SelectItem>
                                        <SelectItem value="LATE">Late</SelectItem>
                                        <SelectItem value="HALF_DAY">Half Day</SelectItem>
                                        <SelectItem value="ON_LEAVE">On Leave</SelectItem>
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
                            ) : filteredAttendance.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No attendance records found
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Check In</TableHead>
                                            <TableHead>Check Out</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAttendance.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">
                                                            {record.employee?.firstName} {record.employee?.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {record.employee?.employeeCode}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{record.employee?.department?.name || '-'}</TableCell>
                                                <TableCell>{formatTime(record.checkIn)}</TableCell>
                                                <TableCell>{formatTime(record.checkOut)}</TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[record.status]}>
                                                        {record.status.replace('_', ' ')}
                                                    </Badge>
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