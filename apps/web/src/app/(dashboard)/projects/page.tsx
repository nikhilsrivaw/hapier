 'use client';                                                                                      
                                                                                                     
  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import Link from 'next/link';
  import DashboardLayout from '@/components/layout/dashboardLayout';
  import { useProjects } from '@/hooks/useProjects';
  import { useEmployees } from '@/hooks/useEmployees';
  import { Project, ProjectStatus } from '@/types';
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
      FolderKanban,
      Calendar,
      User,
      Trash2,
      Edit,
      CheckCircle2,
      Clock,
      PauseCircle,
      XCircle,
      ArrowRight,
  } from 'lucide-react';
  import { toast } from 'sonner';

  const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; icon: any }> = {        
      ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      ON_HOLD: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700', icon: PauseCircle },      
      COMPLETED: { label: 'Completed', color: 'bg-blue-100 text-blue-700', icon: Clock },
      CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: XCircle },
  };

  export default function ProjectsPage() {
      const { projects, isLoading, createProject, updateProject, deleteProject } = useProjects();    
      const { employees } = useEmployees();

      const [isCreateOpen, setIsCreateOpen] = useState(false);
      const [isEditOpen, setIsEditOpen] = useState(false);
      const [selectedProject, setSelectedProject] = useState<Project | null>(null);

      const [formData, setFormData] = useState({
          name: '',
          description: '',
          status: 'ACTIVE' as ProjectStatus,
          startDate: '',
          endDate: '',
      });

      const resetForm = () => {
          setFormData({
              name: '',
              description: '',
              status: 'ACTIVE',
              startDate: '',
              endDate: '',
          });
      };

      const handleCreate = async () => {
          if (!formData.name.trim()) {
              toast.error('Project name is required');
              return;
          }

          try {
              await createProject({
                  ...formData,
                  startDate: formData.startDate || undefined,
                  endDate: formData.endDate || undefined,
              });
              toast.success('Project created');
              setIsCreateOpen(false);
              resetForm();
          } catch (error: any) {
              toast.error(error.message || 'Failed to create project');
          }
      };

      const handleEdit = async () => {
          if (!selectedProject) return;

          try {
              await updateProject(selectedProject.id, {
                  ...formData,
                  startDate: formData.startDate || undefined,
                  endDate: formData.endDate || undefined,
              });
              toast.success('Project updated');
              setIsEditOpen(false);
              setSelectedProject(null);
              resetForm();
          } catch (error: any) {
              toast.error(error.message || 'Failed to update project');
          }
      };

      const handleDelete = async (id: string) => {
          if (!confirm('Delete this project? Tasks will be unlinked but not deleted.')) return;      

          try {
              await deleteProject(id);
              toast.success('Project deleted');
              setIsEditOpen(false);
              setSelectedProject(null);
          } catch (error: any) {
              toast.error(error.message || 'Failed to delete project');
          }
      };

      const openEditDialog = (project: Project) => {
          setSelectedProject(project);
          setFormData({
              name: project.name,
              description: project.description || '',
              status: project.status,
              startDate: project.startDate ? project.startDate.split('T')[0] : '',
              endDate: project.endDate ? project.endDate.split('T')[0] : '',
          });
          setIsEditOpen(true);
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
                          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h1> 
                          <p className="text-gray-500 mt-1">Organize tasks into projects</p>
                      </div>
                      <Button
                          onClick={() => setIsCreateOpen(true)}
                          className="bg-rose-600 hover:bg-rose-700 gap-2"
                      >
                          <Plus className="w-4 h-4" />
                          New Project
                      </Button>
                  </motion.div>

                  {/* Projects Grid */}
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                      {projects.map((project) => {
                          const statusConfig = STATUS_CONFIG[project.status];
                          const StatusIcon = statusConfig.icon;
                          return (
                              <Card
                                  key={project.id}
                                  className="border-0 shadow-lg hover:shadow-xl transition-shadow    
  cursor-pointer group"
                              >
                                  <CardHeader className="pb-3">
                                      <div className="flex items-start justify-between">
                                          <div className="flex items-center gap-3">
                                              <div className="p-2 bg-rose-50 rounded-lg
  group-hover:bg-rose-100 transition-colors">
                                                  <FolderKanban className="w-5 h-5 text-rose-600" /> 
                                              </div>
                                              <div>
                                                  <CardTitle
  className="text-lg">{project.name}</CardTitle>
                                                  <Badge className={`${statusConfig.color} mt-1`}    
  variant="secondary">
                                                      <StatusIcon className="w-3 h-3 mr-1" />        
                                                      {statusConfig.label}
                                                  </Badge>
                                              </div>
                                          </div>
                                          <div className="flex gap-1">
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      openEditDialog(project);
                                                  }}
                                              >
                                                  <Edit className="w-4 h-4" />
                                              </Button>
                                          </div>
                                      </div>
                                  </CardHeader>
                                  <CardContent>
                                      {project.description && (
                                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">    
                                              {project.description}
                                          </p>
                                      )}
                                      <div className="flex items-center justify-between text-sm">    
                                          <div className="flex items-center gap-4 text-gray-600">    
                                              {project.owner && (
                                                  <div className="flex items-center gap-1">
                                                      <User className="w-4 h-4" />
                                                      {project.owner.firstName}
                                                  </div>
                                              )}
                                              <div className="flex items-center gap-1">
                                                  <CheckCircle2 className="w-4 h-4" />
                                                  {project._count?.tasks || 0} tasks
                                              </div>
                                          </div>
                                          <Link href={`/projects/${project.id}`}>
                                              <Button variant="ghost" size="sm" className="gap-1">   
                                                  View
                                                  <ArrowRight className="w-4 h-4" />
                                              </Button>
                                          </Link>
                                      </div>
                                      {(project.startDate || project.endDate) && (
                                          <div className="flex items-center gap-2 mt-3 pt-3 border-t 
  text-sm text-gray-500">
                                              <Calendar className="w-4 h-4" />
                                              {project.startDate && new
  Date(project.startDate).toLocaleDateString()}
                                              {project.startDate && project.endDate && ' - '}        
                                              {project.endDate && new
  Date(project.endDate).toLocaleDateString()}
                                          </div>
                                      )}
                                  </CardContent>
                              </Card>
                          );
                      })}

                      {projects.length === 0 && (
                          <div className="col-span-full text-center py-12">
                              <FolderKanban className="w-12 h-12 mx-auto text-gray-300 mb-4" />      
                              <p className="text-gray-500">No projects yet. Create your first        
  project!</p>
                          </div>
                      )}
                  </motion.div>

                  {/* Create Dialog */}
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                      <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                              <DialogTitle>Create Project</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                  <Label htmlFor="name">Project Name *</Label>
                                  <Input
                                      id="name"
                                      value={formData.name}
                                      onChange={(e) => setFormData({ ...formData, name:
  e.target.value })}
                                      placeholder="Enter project name"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                      id="description"
                                      value={formData.description}
                                      onChange={(e) => setFormData({ ...formData, description:       
  e.target.value })}
                                      placeholder="Enter project description"
                                      rows={3}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select
                                      value={formData.status}
                                      onValueChange={(value) => setFormData({ ...formData, status:   
  value as ProjectStatus })}
                                  >
                                      <SelectTrigger>
                                          <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="ACTIVE">Active</SelectItem>
                                          <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                          <SelectItem value="COMPLETED">Completed</SelectItem>       
                                          <SelectItem value="CANCELLED">Cancelled</SelectItem>       
                                      </SelectContent>
                                  </Select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="startDate">Start Date</Label>
                                      <Input
                                          id="startDate"
                                          type="date"
                                          value={formData.startDate}
                                          onChange={(e) => setFormData({ ...formData, startDate:     
  e.target.value })}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="endDate">End Date</Label>
                                      <Input
                                          id="endDate"
                                          type="date"
                                          value={formData.endDate}
                                          onChange={(e) => setFormData({ ...formData, endDate:       
  e.target.value })}
                                      />
                                  </div>
                              </div>
                          </div>
                          <DialogFooter>
                              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>      
                                  Cancel
                              </Button>
                              <Button onClick={handleCreate} className="bg-rose-600
  hover:bg-rose-700">
                                  Create Project
                              </Button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>

                  {/* Edit Dialog */}
                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                              <DialogTitle>Edit Project</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                  <Label htmlFor="edit-name">Project Name *</Label>
                                  <Input
                                      id="edit-name"
                                      value={formData.name}
                                      onChange={(e) => setFormData({ ...formData, name:
  e.target.value })}
                                      placeholder="Enter project name"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                      id="edit-description"
                                      value={formData.description}
                                      onChange={(e) => setFormData({ ...formData, description:       
  e.target.value })}
                                      placeholder="Enter project description"
                                      rows={3}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select
                                      value={formData.status}
                                      onValueChange={(value) => setFormData({ ...formData, status:   
  value as ProjectStatus })}
                                  >
                                      <SelectTrigger>
                                          <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="ACTIVE">Active</SelectItem>
                                          <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                          <SelectItem value="COMPLETED">Completed</SelectItem>       
                                          <SelectItem value="CANCELLED">Cancelled</SelectItem>       
                                      </SelectContent>
                                  </Select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-startDate">Start Date</Label>
                                      <Input
                                          id="edit-startDate"
                                          type="date"
                                          value={formData.startDate}
                                          onChange={(e) => setFormData({ ...formData, startDate:     
  e.target.value })}
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-endDate">End Date</Label>
                                      <Input
                                          id="edit-endDate"
                                          type="date"
                                          value={formData.endDate}
                                          onChange={(e) => setFormData({ ...formData, endDate:       
  e.target.value })}
                                      />
                                  </div>
                              </div>
                          </div>
                          <DialogFooter className="flex justify-between">
                              <Button
                                  variant="destructive"
                                  onClick={() => {
                                      if (selectedProject) handleDelete(selectedProject.id);
                                  }}
                              >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                              </Button>
                              <div className="flex gap-2">
                                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>    
                                      Cancel
                                  </Button>
                                  <Button onClick={handleEdit} className="bg-rose-600
  hover:bg-rose-700">
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
