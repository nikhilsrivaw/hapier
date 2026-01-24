'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboardLayout';
import { useTasks } from '@/hooks/useTasks';
import { useEmployees } from '@/hooks/useEmployees';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common';
import {
    Plus,
    LayoutList,
    LayoutGrid,
    Calendar,
    User,
    Trash2,
    Edit,
    GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Review',
    DONE: 'Done',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    REVIEW: 'bg-yellow-100 text-yellow-800',
    DONE: 'bg-green-100 text-green-800',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-blue-100 text-blue-600',
    HIGH: 'bg-orange-100 text-orange-600',
    URGENT: 'bg-red-100 text-red-600',
};

export default function TasksPage() {
    const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
    const { employees } = useEmployees();

    const [view, setView] = useState<'list' | 'board'>('board');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TODO' as TaskStatus,
        priority: 'MEDIUM' as TaskPriority,
        dueDate: '',
        assigneeId: '',
    });

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: '',
            assigneeId: '',
        });
    };

    const handleCreate = async () => {
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            await createTask({
                ...formData,
                assigneeId: formData.assigneeId || undefined,
                dueDate: formData.dueDate || undefined,
            });
            toast.success('Task created');
            setIsCreateOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create task');
        }
    };

    const handleEdit = async () => {
        if (!selectedTask) return;

        try {
            await updateTask(selectedTask.id, {
                ...formData,
                assigneeId: formData.assigneeId || null,
                dueDate: formData.dueDate || undefined,
            });
            toast.success('Task updated');
            setIsEditOpen(false);
            setSelectedTask(null);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update task');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this task?')) return;

        try {
            await deleteTask(id);
            toast.success('Task deleted');
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete task');
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
        try {
            await updateTask(taskId, { status: newStatus });
            toast.success('Status updated');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    const openEditDialog = (task: Task) => {
        setSelectedTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            assigneeId: task.assigneeId || '',
        });
        setIsEditOpen(true);
    };

    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter((task) => task.status === status);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </DashboardLayout>
        );
    }

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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tasks</h1>
                        <p className="text-gray-500 mt-1">Manage and track your team's work</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <Button
                                variant={view === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView('list')}
                                className="gap-2"
                            >
                                <LayoutList className="w-4 h-4" />
                                List
                            </Button>
                            <Button
                                variant={view === 'board' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView('board')}
                                className="gap-2"
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Board
                            </Button>
                        </div>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-rose-600 hover:bg-rose-700 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Task
                        </Button>
                    </div>
                </motion.div>

                {/* Board View */}
                {view === 'board' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'] as TaskStatus[]).map((status) => (
                            <div key={status} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-700">{STATUS_LABELS[status]}</h3>
                                    <Badge
                                        variant="secondary">{getTasksByStatus(status).length}</Badge>
                                </div>
                                <div className="space-y-3">
                                    {getTasksByStatus(status).map((task) => (
                                        <Card
                                            key={task.id}
                                            className="cursor-pointer hover:shadow-md transition-shadow"
                                            onClick={() => openEditDialog(task)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-medium text-gray-900 clamp-2">
                                                        {task.title}
                                                    </h4>
                                                    <Badge
                                                        className={PRIORITY_COLORS[task.priority]} variant="secondary">
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                                {task.description && (
                                                    <p className="text-sm text-gray-500 mt-2    line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                                    {task.assignee ? (
                                                        <div className="flex items-center gap-2  text-sm text-gray-600">
                                                            <User className="w-3 h-3" />
                                                            {task.assignee.firstName}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">Unassigned</span>
                                                    )}
                                                    {task.dueDate && (
                                                        <div className="flex items-center gap-1  text-sm text-gray-600">
                                                            <Calendar className="w-3 h-3" />
                                                            {new
                                                                Date(task.dueDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {getTasksByStatus(status).length === 0 && (
                                        <p className="text-sm text-gray-400 text-center py-4">No
                                            tasks</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* List View */}
                {view === 'list' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-0">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="text-left p-4 font-medium text-gray-600">Title</th>
                                            <th className="text-left p-4 font-medium text-gray-600">Status</th>
                                            <th className="text-left p-4 font-medium text-gray-600">Priority</th>
                                            <th className="text-left p-4 font-medium text-gray-600">Assignee</th>
                                            <th className="text-left p-4 font-medium text-gray-600">Due Date</th>
                                            <th className="text-right p-4 font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4">
                                                    <span className="font-medium text-gray-900">{task.title}</span>
                                                </td>
                                                <td className="p-4">
                                                    <Select
                                                        value={task.status}
                                                        onValueChange={(value) =>
                                                            handleStatusChange(task.id, value as TaskStatus)}
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="TODO">To
                                                                Do</SelectItem>
                                                            <SelectItem value="IN_PROGRESS">In
                                                                Progress</SelectItem>
                                                            <SelectItem
                                                                value="REVIEW">Review</SelectItem>
                                                            <SelectItem
                                                                value="DONE">Done</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        className={PRIORITY_COLORS[task.priority]} variant="secondary">
                                                        {task.priority}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    {task.assignee
                                                        ? `${task.assignee.firstName} ${task.assignee.lastName}`
                                                        : '-'}
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    {task.dueDate
                                                        ? new
                                                            Date(task.dueDate).toLocaleDateString()
                                                        : '-'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end   gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditDialog(task)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(task.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {tasks.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                                    No tasks yet. Create your first task!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Create Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({
                                        ...formData, title:
                                            e.target.value
                                    })}
                                    placeholder="Enter task title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({
                                        ...formData, description:
                                            e.target.value
                                    })}
                                    placeholder="Enter task description"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            priority: value as TaskPriority
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            status: value as TaskStatus
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">To Do</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In
                                                Progress</SelectItem>
                                            <SelectItem value="REVIEW">Review</SelectItem>
                                            <SelectItem value="DONE">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({
                                            ...formData, dueDate:
                                                e.target.value
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assignee</Label>
                                    <Select
                                        value={formData.assigneeId}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            assigneeId: value
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {emp.firstName} {emp.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate} className="bg-rose-600 hover:bg-rose-700">
                                Create Task
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Title *</Label>
                                <Input
                                    id="edit-title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({
                                        ...formData, title:
                                            e.target.value
                                    })}
                                    placeholder="Enter task title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({
                                        ...formData, description:
                                            e.target.value
                                    })}
                                    placeholder="Enter task description"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            priority: value as TaskPriority
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            status: value as TaskStatus
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">To Do</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In
                                                Progress</SelectItem>
                                            <SelectItem value="REVIEW">Review</SelectItem>
                                            <SelectItem value="DONE">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-dueDate">Due Date</Label>
                                    <Input
                                        id="edit-dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({
                                            ...formData, dueDate:
                                                e.target.value
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assignee</Label>
                                    <Select
                                        value={formData.assigneeId}
                                        onValueChange={(value) => setFormData({
                                            ...formData,
                                            assigneeId: value
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {emp.firstName} {emp.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex justify-between">
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (selectedTask) handleDelete(selectedTask.id);
                                    setIsEditOpen(false);
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleEdit} className="bg-rose-600 hover:bg-rose-700">
                                    Save Changes
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
