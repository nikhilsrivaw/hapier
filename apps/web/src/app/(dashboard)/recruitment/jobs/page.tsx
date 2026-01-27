'use client';                                                                                            
  import { useState } from 'react';                                                                     
  import { useJobs } from '@/hooks/useRecruitment';      
  import { useDepartments } from '@/hooks/useDepartments';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogFooter,
  } from '@/components/ui/dialog';
  import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
  } from '@/components/ui/select';
  import {
      Plus,
      Search,
      MapPin,
      Users,
      MoreHorizontal,
      Edit2,
      Trash2,
      Loader2,
      Briefcase
  } from 'lucide-react';
  import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import Link from 'next/link';
  import { Job, JobStatus, JobType, ExperienceLevel } from '@/types';
  import { format } from 'date-fns';
  import { toast } from 'sonner';

  const statusStyles: Record<JobStatus, string> = {
      DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      OPEN: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      PAUSED: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      CLOSED: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      FILLED: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const initialForm = {
      title: '',
      description: '',
      requirements: '',
      responsibilities: '',
      location: '',
      jobType: 'FULL_TIME' as JobType,
      experienceLevel: 'MID' as ExperienceLevel,
      salaryMin: '',
      salaryMax: '',
      status: 'DRAFT' as JobStatus,
      departmentId: '',
  };

  export default function JobsPage() {
      const [statusFilter, setStatusFilter] = useState('all');
      const [search, setSearch] = useState('');
      const [isCreateOpen, setIsCreateOpen] = useState(false);
      const [isEditOpen, setIsEditOpen] = useState(false);
      const [editingJob, setEditingJob] = useState<Job | null>(null);
      const [form, setForm] = useState(initialForm);
      const [submitting, setSubmitting] = useState(false);

      const { jobs, isLoading, createJob, updateJob, deleteJob } = useJobs(
          statusFilter !== 'all' ? { status: statusFilter } : undefined
      );
      const { departments } = useDepartments();

      const filtered = jobs.filter(j =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.location?.toLowerCase().includes(search.toLowerCase())
      );

      const handleCreate = async () => {
          if (!form.title.trim()) return toast.error('Title required');
          setSubmitting(true);
          try {
              await createJob({
                  ...form,
                  salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
                  salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
                  departmentId: form.departmentId || undefined,
              });
              toast.success('Job created');
              setIsCreateOpen(false);
              setForm(initialForm);
          } catch (e: any) {
              toast.error(e.message);
          } finally {
              setSubmitting(false);
          }
      };

      const handleEdit = async () => {
          if (!editingJob || !form.title.trim()) return;
          setSubmitting(true);
          try {
              await updateJob(editingJob.id, {
                  ...form,
                  salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
                  salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
                  departmentId: form.departmentId || undefined,
              });
              toast.success('Job updated');
              setIsEditOpen(false);
              setEditingJob(null);
          } catch (e: any) {
              toast.error(e.message);
          } finally {
              setSubmitting(false);
          }
      };

      const openEdit = (job: Job) => {
          setEditingJob(job);
          setForm({
              title: job.title,
              description: job.description || '',
              requirements: job.requirements || '',
              responsibilities: job.responsibilities || '',
              location: job.location || '',
              jobType: job.jobType,
              experienceLevel: job.experienceLevel,
              salaryMin: job.salaryMin?.toString() || '',
              salaryMax: job.salaryMax?.toString() || '',
              status: job.status,
              departmentId: job.departmentId || '',
          });
          setIsEditOpen(true);
      };

      const handleDelete = async (job: Job) => {
          if (!confirm(`Delete "${job.title}"?`)) return;
          try {
              await deleteJob(job.id);
              toast.success('Job deleted');
          } catch (e: any) {
              toast.error(e.message);
          }
      };

      const FormFields = () => (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                  <Label>Job Title *</Label>
                  <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="mt-1.5"
                  />
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <Label>Department</Label>
                      <Select value={form.departmentId || 'none'} onValueChange={(v) => setForm({       
  ...form, departmentId: v === 'none' ? '' : v })}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select"
  /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {departments.map(d => <SelectItem key={d.id}
  value={d.id}>{d.name}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label>Location</Label>
                      <Input value={form.location} onChange={(e) => setForm({ ...form, location:        
  e.target.value })} placeholder="Mumbai, Remote" className="mt-1.5" />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <Label>Job Type</Label>
                      <Select value={form.jobType} onValueChange={(v) => setForm({ ...form, jobType: v as JobType })}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="FULL_TIME">Full Time</SelectItem>
                              <SelectItem value="PART_TIME">Part Time</SelectItem>
                              <SelectItem value="CONTRACT">Contract</SelectItem>
                              <SelectItem value="INTERNSHIP">Internship</SelectItem>
                              <SelectItem value="REMOTE">Remote</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label>Experience</Label>
                      <Select value={form.experienceLevel} onValueChange={(v) => setForm({ ...form,     
  experienceLevel: v as ExperienceLevel })}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="ENTRY">Entry</SelectItem>
                              <SelectItem value="MID">Mid</SelectItem>
                              <SelectItem value="SENIOR">Senior</SelectItem>
                              <SelectItem value="LEAD">Lead</SelectItem>
                              <SelectItem value="EXECUTIVE">Executive</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <Label>Min Salary</Label>
                      <Input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form,   
  salaryMin: e.target.value })} placeholder="500000" className="mt-1.5" />
                  </div>
                  <div>
                      <Label>Max Salary</Label>
                      <Input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form,   
  salaryMax: e.target.value })} placeholder="1000000" className="mt-1.5" />
                  </div>
              </div>
              <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as     
  JobStatus })}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="PAUSED">Paused</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                          <SelectItem value="FILLED">Filled</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description:   
  e.target.value })} rows={3} className="mt-1.5" />
              </div>
              <div>
                  <Label>Requirements</Label>
                  <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: 
  e.target.value })} rows={3} className="mt-1.5" />
              </div>
          </div>
      );

      if (isLoading) {
          return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6     
  animate-spin text-violet-600" /></div>;
      }

      return (
          <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">      
                  <div>
                      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Jobs</h1>    
                      <p className="text-gray-500 text-sm mt-1">{jobs.length} total positions</p>       
                  </div>
                  <Button onClick={() => { setForm(initialForm); setIsCreateOpen(true); }}
  className="bg-violet-600 hover:bg-violet-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Post Job
                  </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
   />
                      <Input value={search} onChange={(e) => setSearch(e.target.value)}
  placeholder="Search jobs..." className="pl-9" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status"       
  /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="PAUSED">Paused</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                          <SelectItem value="FILLED">Filled</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              {/* Jobs List */}
              {filtered.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border
  border-gray-200 dark:border-gray-800">
                      <Briefcase className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" /> 
                      <p className="text-gray-500">No jobs found</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsCreateOpen(true)}> 
                          <Plus className="w-4 h-4 mr-2" />
                          Post first job
                      </Button>
                  </div>
              ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 overflow-hidden">
                      <table className="w-full">
                          <thead>
                              <tr className="border-b border-gray-100 dark:border-gray-800">
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3">Job</th>
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3 hidden md:table-cell">Location</th>
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3 hidden sm:table-cell">Applicants</th>
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3">Status</th>
                                  <th className="text-right text-xs font-medium text-gray-500 uppercase 
  tracking-wide px-4 py-3"></th>
                              </tr>
                          </thead>
                          <tbody>
                              {filtered.map((job) => (
                                  <tr key={job.id} className="border-b border-gray-50
  dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                      <td className="px-4 py-3">
                                          <Link href={`/recruitment/jobs/${job.id}`} className="block"> 
                                              <p className="font-medium text-gray-900 dark:text-white   
  hover:text-violet-600">{job.title}</p>
                                              <p className="text-sm text-gray-500">{job.department?.name
   || 'No department'}</p>
                                          </Link>
                                      </td>
                                      <td className="px-4 py-3 hidden md:table-cell">
                                          <span className="text-sm text-gray-600 dark:text-gray-400 flex
   items-center gap-1">
                                              <MapPin className="w-3 h-3" />
                                              {job.location || '-'}
                                          </span>
                                      </td>
                                      <td className="px-4 py-3 hidden sm:table-cell">
                                          <span className="text-sm text-gray-600 dark:text-gray-400 flex
   items-center gap-1">
                                              <Users className="w-3 h-3" />
                                              {job._count?.applications || 0}
                                          </span>
                                      </td>
                                      <td className="px-4 py-3">
                                          <span className={`text-xs font-medium px-2 py-1 rounded       
  ${statusStyles[job.status]}`}>
                                              {job.status}
                                          </span>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                          <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-8    
  w-8">
                                                      <MoreHorizontal className="w-4 h-4" />
                                                  </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                  <DropdownMenuItem onClick={() => openEdit(job)}>      
                                                      <Edit2 className="w-4 h-4 mr-2" />Edit
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem onClick={() => handleDelete(job)}   
  className="text-red-600">
                                                      <Trash2 className="w-4 h-4 mr-2" />Delete
                                                  </DropdownMenuItem>
                                              </DropdownMenuContent>
                                          </DropdownMenu>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* Create Dialog */}
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                          <DialogTitle>Post New Job</DialogTitle>
                      </DialogHeader>
                      <FormFields />
                      <DialogFooter>
                          <Button variant="outline" onClick={() =>
  setIsCreateOpen(false)}>Cancel</Button>
                          <Button onClick={handleCreate} disabled={submitting} className="bg-violet-600 
  hover:bg-violet-700">
                              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Post Job
                          </Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>

              {/* Edit Dialog */}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                          <DialogTitle>Edit Job</DialogTitle>
                      </DialogHeader>
                      <FormFields />
                      <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                          <Button onClick={handleEdit} disabled={submitting} className="bg-violet-600   
  hover:bg-violet-700">
                              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Save
                          </Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
          </div>
      );
  }
