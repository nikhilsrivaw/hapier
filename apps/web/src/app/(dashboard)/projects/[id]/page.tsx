 'use client';

  import { useState, useEffect } from 'react';
  import { useParams, useRouter } from 'next/navigation';
  import { motion } from 'framer-motion';
  import Link from 'next/link';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import { projectService } from '@/services/project.service';
  import { taskService } from '@/services/task.service';
  import { Project, Task, TaskStatus, TaskPriority } from '@/types';
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
      ArrowLeft,
      Plus,
      FolderKanban,
      Calendar,
      User,
      CheckCircle2,
      Clock,
      PauseCircle,
      XCircle,
      AlertCircle,
      Edit,
      Trash2,
  } from 'lucide-react';
  import { toast } from 'sonner';
  import { useEmployees } from '@/hooks/useEmployees';

  const PROJECT_STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {       
      ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      ON_HOLD: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700', icon: PauseCircle },      
      COMPLETED: { label: 'Completed', color: 'bg-blue-100 text-blue-700', icon: Clock },
      CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  };

  const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
      TODO: { label: 'To Do', color: 'bg-gray-100 text-gray-700' },
      IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
      REVIEW: { label: 'Review', color: 'bg-yellow-100 text-yellow-700' },
      DONE: { label: 'Done', color: 'bg-green-100 text-green-700' },
  };

  const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
      LOW: { label: 'Low', color: 'bg-gray-100 text-gray-600' },
      MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-600' },
      HIGH: { label: 'High', color: 'bg-orange-100 text-orange-600' },
      URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-600' },
  };

  export default function ProjectDetailPage() {
      const params = useParams();
      const router = useRouter();
      const projectId = params.id as string;

      const [project, setProject] = useState<Project | null>(null);
      const [tasks, setTasks] = useState<Task[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
      const [editingTask, setEditingTask] = useState<Task | null>(null);

      const { employees } = useEmployees();

      const [taskForm, setTaskForm] = useState({
          title: '',
          description: '',
          status: 'TODO' as TaskStatus,
          priority: 'MEDIUM' as TaskPriority,
          dueDate: '',
          assigneeId: '',
      });

      const fetchData = async () => {
          try {
              const [projectData, tasksData] = await Promise.all([
                  projectService.getById(projectId),
                  taskService.getAll({ projectId }),
              ]);
              setProject(projectData);
              setTasks(tasksData);
          } catch (error) {
              toast.error('Failed to load project');
              router.push('/projects');
          } finally {
              setIsLoading(false);
          }
      };

      useEffect(() => {
          fetchData();
      }, [projectId]);

      const resetTaskForm = () => {
          setTaskForm({
              title: '',
              description: '',
              status: 'TODO',
              priority: 'MEDIUM',
              dueDate: '',
              assigneeId: '',
          });
          setEditingTask(null);
      };

      const handleCreateTask = async () => {
          if (!taskForm.title.trim()) {
              toast.error('Task title is required');
              return;
          }

          try {
              const newTask = await taskService.create({
                  ...taskForm,
                  projectId,
                  assigneeId: taskForm.assigneeId || undefined,
                  dueDate: taskForm.dueDate || undefined,
              });
              setTasks([newTask, ...tasks]);
              toast.success('Task created');
              setIsTaskDialogOpen(false);
              resetTaskForm();
          } catch (error: any) {
              toast.error(error.message || 'Failed to create task');
          }
      };

      const handleUpdateTask = async () => {
          if (!editingTask) return;

          try {
              const updatedTask = await taskService.update(editingTask.id, {
                  ...taskForm,
                  assigneeId: taskForm.assigneeId || null,
                  dueDate: taskForm.dueDate || undefined,
              });
              setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
              toast.success('Task updated');
              setIsTaskDialogOpen(false);
              resetTaskForm();
          } catch (error: any) {
              toast.error(error.message || 'Failed to update task');
          }
      };

      const handleDeleteTask = async (taskId: string) => {
          if (!confirm('Delete this task?')) return;

          try {
              await taskService.delete(taskId);
              setTasks(tasks.filter(t => t.id !== taskId));
              toast.success('Task deleted');
              setIsTaskDialogOpen(false);
              resetTaskForm();
          } catch (error: any) {
              toast.error(error.message || 'Failed to delete task');
          }
      };

      const openEditTask = (task: Task) => {
          setEditingTask(task);
          setTaskForm({
              title: task.title,
              description: task.description || '',
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
              assigneeId: task.assigneeId || '',
          });
          setIsTaskDialogOpen(true);
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

      if (!project) return null;

      const statusConfig = PROJECT_STATUS_CONFIG[project.status];
      const StatusIcon = statusConfig.icon;

      const tasksByStatus = {
          TODO: tasks.filter(t => t.status === 'TODO'),
          IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
          REVIEW: tasks.filter(t => t.status === 'REVIEW'),
          DONE: tasks.filter(t => t.status === 'DONE'),
      };

      return (
          <DashboardLayout>
              <div className="space-y-6">
                  {/* Header */}
                  <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                  >
                      <Link href="/projects">
                          <Button variant="ghost" size="sm" className="mb-4 gap-2">
                              <ArrowLeft className="w-4 h-4" />
                              Back to Projects
                          </Button>
                      </Link>

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between    
  gap-4">
                          <div className="flex items-start gap-4">
                              <div className="p-3 bg-rose-50 rounded-xl">
                                  <FolderKanban className="w-8 h-8 text-rose-600" />
                              </div>
                              <div>
                                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">      
                                      {project.name}
                                  </h1>
                                  <div className="flex items-center gap-3 mt-2">
                                      <Badge className={statusConfig.color} variant="secondary">     
                                          <StatusIcon className="w-3 h-3 mr-1" />
                                          {statusConfig.label}
                                      </Badge>
                                      {project.owner && (
                                          <span className="text-sm text-gray-500 flex items-center   
  gap-1">
                                              <User className="w-4 h-4" />
                                              {project.owner.firstName} {project.owner.lastName}     
                                          </span>
                                      )}
                                  </div>
                                  {project.description && (
                                      <p className="text-gray-500 mt-2
  max-w-2xl">{project.description}</p>
                                  )}
                              </div>
                          </div>
                          <Button
                              onClick={() => {
                                  resetTaskForm();
                                  setIsTaskDialogOpen(true);
                              }}
                              className="bg-rose-600 hover:bg-rose-700 gap-2"
                          >
                              <Plus className="w-4 h-4" />
                              Add Task
                          </Button>
                      </div>

                      {(project.startDate || project.endDate) && (
                          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">       
                              <Calendar className="w-4 h-4" />
                              {project.startDate && new Date(project.startDate).toLocaleDateString()}
                              {project.startDate && project.endDate && ' - '}
                              {project.endDate && new Date(project.endDate).toLocaleDateString()}    
                          </div>
                      )}
                  </motion.div>

                  {/* Task Stats */}
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                  >
                      {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
                          const config = TASK_STATUS_CONFIG[status as TaskStatus];
                          return (
                              <Card key={status} className="border-0 shadow">
                                  <CardContent className="p-4">
                                      <div className="text-2xl font-bold">{statusTasks.length}</div> 
                                      <div className="text-sm text-gray-500">{config.label}</div>    
                                  </CardContent>
                              </Card>
                          );
                      })}
                  </motion.div>

                  {/* Tasks List */}
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                  >
                      <Card className="border-0 shadow-lg">
                          <CardHeader>
                              <CardTitle>Tasks ({tasks.length})</CardTitle>
                          </CardHeader>
                          <CardContent>
                              {tasks.length === 0 ? (
                                  <div className="text-center py-8">
                                      <CheckCircle2 className="w-12 h-12 mx-auto text-gray-300 mb-4" 
  />
                                      <p className="text-gray-500">No tasks yet. Add your first      
  task!</p>
                                  </div>
                              ) : (
                                  <div className="space-y-3">
                                      {tasks.map((task) => {
                                          const taskStatusConfig = TASK_STATUS_CONFIG[task.status];  
                                          const priorityConfig = PRIORITY_CONFIG[task.priority];     
                                          const isOverdue = task.dueDate && new Date(task.dueDate) < 
  new Date() && task.status !== 'DONE';

                                          return (
                                              <div
                                                  key={task.id}
                                                  className="flex items-center justify-between p-4   
  bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                                  onClick={() => openEditTask(task)}
                                              >
                                                  <div className="flex-1">
                                                      <div className="flex items-center gap-2">      
                                                          <span
  className="font-medium">{task.title}</span>
                                                          {isOverdue && (
                                                              <AlertCircle className="w-4 h-4        
  text-red-500" />
                                                          )}
                                                      </div>
                                                      <div className="flex items-center gap-2 mt-1"> 
                                                          <Badge className={taskStatusConfig.color}  
  variant="secondary">
                                                              {taskStatusConfig.label}
                                                          </Badge>
                                                          <Badge className={priorityConfig.color}    
  variant="secondary">
                                                              {priorityConfig.label}
                                                          </Badge>
                                                          {task.assignee && (
                                                              <span className="text-xs
  text-gray-500">
                                                                  {task.assignee.firstName}
                                                              </span>
                                                          )}
                                                          {task.dueDate && (
                                                              <span className={`text-xs ${isOverdue ?
   'text-red-500' : 'text-gray-500'}`}>
                                                                  Due: {new
  Date(task.dueDate).toLocaleDateString()}
                                                              </span>
                                                          )}
                                                      </div>
                                                  </div>
                                                  <Button variant="ghost" size="sm">
                                                      <Edit className="w-4 h-4" />
                                                  </Button>
                                              </div>
                                          );
                                      })}
                                  </div>
                              )}
                          </CardContent>
                      </Card>
                  </motion.div>

                  {/* Task Dialog */}
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                      <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                              <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle> 
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                  <Label htmlFor="title">Title *</Label>
                                  <Input
                                      id="title"
                                      value={taskForm.title}
                                      onChange={(e) => setTaskForm({ ...taskForm, title:
  e.target.value })}
                                      placeholder="Enter task title"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                      id="description"
                                      value={taskForm.description}
                                      onChange={(e) => setTaskForm({ ...taskForm, description:       
  e.target.value })}
                                      placeholder="Enter task description"
                                      rows={3}
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select
                                          value={taskForm.status}
                                          onValueChange={(value) => setTaskForm({ ...taskForm,       
  status: value as TaskStatus })}
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
                                  <div className="space-y-2">
                                      <Label>Priority</Label>
                                      <Select
                                          value={taskForm.priority}
                                          onValueChange={(value) => setTaskForm({ ...taskForm,       
  priority: value as TaskPriority })}
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
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="dueDate">Due Date</Label>
                                      <Input
                                          id="dueDate"
                                          type="date"
                                          value={taskForm.dueDate}
                                          onChange={(e) => setTaskForm({ ...taskForm, dueDate:       
  e.target.value })}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label>Assignee</Label>
                                      <Select
                                          value={taskForm.assigneeId || 'none'}
                                          onValueChange={(value) => setTaskForm({ ...taskForm,
  assigneeId: value === 'none' ? '' : value })}
                                      >
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select assignee" />
                                          </SelectTrigger>
                                          <SelectContent>
                                              <SelectItem value="none">Unassigned</SelectItem>
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
                          <DialogFooter className={editingTask ? 'flex justify-between' : ''}>       
                              {editingTask && (
                                  <Button
                                      variant="destructive"
                                      onClick={() => handleDeleteTask(editingTask.id)}
                                  >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                  </Button>
                              )}
                              <div className="flex gap-2">
                                  <Button variant="outline" onClick={() => {
                                      setIsTaskDialogOpen(false);
                                      resetTaskForm();
                                  }}>
                                      Cancel
                                  </Button>
                                  <Button
                                      onClick={editingTask ? handleUpdateTask : handleCreateTask}    
                                      className="bg-rose-600 hover:bg-rose-700"
                                  >
                                      {editingTask ? 'Save Changes' : 'Create Task'}
                                  </Button>
                              </div>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
              </div>
          </DashboardLayout>
      );
  }
