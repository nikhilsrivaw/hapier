 'use client';                                                                                            
  import { useState } from 'react';                                                                     
  import { useInterviews, useCandidates, useJobs } from '@/hooks/useRecruitment';
  import { useEmployees } from '@/hooks/useEmployees';
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
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import {
      Plus,
      Search,
      MoreHorizontal,
      Loader2,
      Video,
      Calendar,
      Clock,
      User,
      Star,
      MessageSquare,
      CheckCircle,
      XCircle,
      AlertCircle
  } from 'lucide-react';
  import { Interview, InterviewType, InterviewStatus } from '@/types';
  import { format, isToday, isTomorrow, isPast } from 'date-fns';
  import { toast } from 'sonner';

  const statusStyles: Record<InterviewStatus, { bg: string; icon: any }> = {
      SCHEDULED: { bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', icon: Calendar
   },
      COMPLETED: { bg: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400', icon:     
  CheckCircle },
      CANCELLED: { bg: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },  
      NO_SHOW: { bg: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', icon:   
  AlertCircle },
      RESCHEDULED: { bg: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',     
  icon: Clock },
  };

  const typeLabels: Record<InterviewType, string> = {
      PHONE: 'Phone',
      VIDEO: 'Video Call',
      IN_PERSON: 'In Person',
      TECHNICAL: 'Technical',
      HR: 'HR Round',
      FINAL: 'Final',
  };

  const initialForm = {
      candidateId: '',
      jobId: '',
      interviewerId: '',
      scheduledAt: '',
      scheduledTime: '',
      duration: '60',
      type: 'VIDEO' as InterviewType,
      location: '',
  };

  export default function InterviewsPage() {
      const [statusFilter, setStatusFilter] = useState('all');
      const [search, setSearch] = useState('');
      const [isCreateOpen, setIsCreateOpen] = useState(false);
      const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
      const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
      const [form, setForm] = useState(initialForm);
      const [feedback, setFeedback] = useState({ text: '', rating: 0 });
      const [submitting, setSubmitting] = useState(false);

      const { interviews, isLoading, createInterview, addFeedback, updateInterview } = useInterviews(   
          statusFilter !== 'all' ? { status: statusFilter } : undefined
      );
      const { candidates } = useCandidates();
      const { jobs } = useJobs();
      const { employees } = useEmployees();

      const filtered = interviews.filter(i =>
          `${i.candidate?.firstName}
  ${i.candidate?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          i.job?.title?.toLowerCase().includes(search.toLowerCase())
      );

      const grouped = {
          today: filtered.filter(i => isToday(new Date(i.scheduledAt)) && i.status === 'SCHEDULED'),    
          tomorrow: filtered.filter(i => isTomorrow(new Date(i.scheduledAt)) && i.status ===
  'SCHEDULED'),
          upcoming: filtered.filter(i => !isToday(new Date(i.scheduledAt)) && !isTomorrow(new
  Date(i.scheduledAt)) && !isPast(new Date(i.scheduledAt)) && i.status === 'SCHEDULED'),
          past: filtered.filter(i => isPast(new Date(i.scheduledAt)) || i.status !== 'SCHEDULED'),      
      };

      const handleCreate = async () => {
          if (!form.candidateId || !form.jobId || !form.interviewerId || !form.scheduledAt ||
  !form.scheduledTime) {
              toast.error('Fill all required fields');
              return;
          }
          setSubmitting(true);
          try {
              const scheduledAt = new Date(`${form.scheduledAt}T${form.scheduledTime}`).toISOString();  
              await createInterview({
                  candidateId: form.candidateId,
                  jobId: form.jobId,
                  interviewerId: form.interviewerId,
                  scheduledAt,
                  duration: parseInt(form.duration),
                  type: form.type,
                  location: form.location || undefined,
              });
              toast.success('Interview scheduled');
              setIsCreateOpen(false);
              setForm(initialForm);
          } catch (e: any) {
              toast.error(e.message);
          } finally {
              setSubmitting(false);
          }
      };

      const handleFeedback = async () => {
          if (!selectedInterview || !feedback.text || !feedback.rating) {
              toast.error('Provide feedback and rating');
              return;
          }
          setSubmitting(true);
          try {
              await addFeedback(selectedInterview.id, feedback.text, feedback.rating);
              toast.success('Feedback added');
              setIsFeedbackOpen(false);
              setSelectedInterview(null);
              setFeedback({ text: '', rating: 0 });
          } catch (e: any) {
              toast.error(e.message);
          } finally {
              setSubmitting(false);
          }
      };

      const handleStatusChange = async (interview: Interview, status: InterviewStatus) => {
          try {
              await updateInterview(interview.id, { status });
              toast.success('Status updated');
          } catch (e: any) {
              toast.error(e.message);
          }
      };

      const openFeedback = (interview: Interview) => {
          setSelectedInterview(interview);
          setFeedback({ text: interview.feedback || '', rating: interview.rating || 0 });
          setIsFeedbackOpen(true);
      };

      const InterviewCard = ({ interview }: { interview: Interview }) => {
          const StatusIcon = statusStyles[interview.status].icon;
          return (
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg
   border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500
  to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {interview.candidate?.firstName?.[0]}{interview.candidate?.lastName?.[0]}     
                      </div>
                      <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                              {interview.candidate?.firstName} {interview.candidate?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{interview.job?.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(new Date(interview.scheduledAt), 'h:mm a')}
                              </span>
                              <span className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  {typeLabels[interview.type]}
                              </span>
                              <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {interview.interviewer?.firstName}
                              </span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1   
  ${statusStyles[interview.status].bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          {interview.status}
                      </span>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openFeedback(interview)}>
                                  <MessageSquare className="w-4 h-4 mr-2" />Add Feedback
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(interview,
  'COMPLETED')}>
                                  <CheckCircle className="w-4 h-4 mr-2" />Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(interview,
  'CANCELLED')} className="text-red-600">
                                  <XCircle className="w-4 h-4 mr-2" />Cancel
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(interview, 'NO_SHOW')}
   className="text-orange-600">
                                  <AlertCircle className="w-4 h-4 mr-2" />No Show
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
              </div>
          );
      };

      if (isLoading) {
          return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6     
  animate-spin text-violet-600" /></div>;
      }

      return (
          <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">      
                  <div>
                      <h1 className="text-2xl font-semibold text-gray-900
  dark:text-white">Interviews</h1>
                      <p className="text-gray-500 text-sm mt-1">{interviews.length} total interviews</p>
                  </div>
                  <Button onClick={() => { setForm(initialForm); setIsCreateOpen(true); }}
  className="bg-violet-600 hover:bg-violet-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Interview
                  </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
   />
                      <Input value={search} onChange={(e) => setSearch(e.target.value)}
  placeholder="Search interviews..." className="pl-9" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status"       
  /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="NO_SHOW">No Show</SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              {/* Interviews */}
              {filtered.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border
  border-gray-200 dark:border-gray-800">
                      <Video className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />     
                      <p className="text-gray-500">No interviews found</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsCreateOpen(true)}> 
                          <Plus className="w-4 h-4 mr-2" />
                          Schedule first interview
                      </Button>
                  </div>
              ) : (
                  <div className="space-y-6">
                      {grouped.today.length > 0 && (
                          <div>
                              <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center   
  gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />  
                                  Today
                              </h2>
                              <div className="space-y-2">
                                  {grouped.today.map(i => <InterviewCard key={i.id} interview={i} />)}  
                              </div>
                          </div>
                      )}
                      {grouped.tomorrow.length > 0 && (
                          <div>
                              <h2 className="text-sm font-medium text-gray-500 mb-3">Tomorrow</h2>      
                              <div className="space-y-2">
                                  {grouped.tomorrow.map(i => <InterviewCard key={i.id} interview={i}    
  />)}
                              </div>
                          </div>
                      )}
                      {grouped.upcoming.length > 0 && (
                          <div>
                              <h2 className="text-sm font-medium text-gray-500 mb-3">Upcoming</h2>      
                              <div className="space-y-2">
                                  {grouped.upcoming.map(i => <InterviewCard key={i.id} interview={i}    
  />)}
                              </div>
                          </div>
                      )}
                      {grouped.past.length > 0 && (
                          <div>
                              <h2 className="text-sm font-medium text-gray-500 mb-3">Past & Others</h2> 
                              <div className="space-y-2">
                                  {grouped.past.map(i => <InterviewCard key={i.id} interview={i} />)}   
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {/* Create Dialog */}
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                          <DialogTitle>Schedule Interview</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                          <div>
                              <Label>Candidate *</Label>
                              <Select value={form.candidateId || 'none'} onValueChange={(v) => setForm({
   ...form, candidateId: v === 'none' ? '' : v })}>
                                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select    
  candidate" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="none">Select candidate</SelectItem>
                                      {candidates.map(c => (
                                          <SelectItem key={c.id} value={c.id}>{c.firstName}
  {c.lastName}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div>
                              <Label>Job *</Label>
                              <Select value={form.jobId || 'none'} onValueChange={(v) => setForm({      
  ...form, jobId: v === 'none' ? '' : v })}>
                                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select    
  job" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="none">Select job</SelectItem>
                                      {jobs.map(j => <SelectItem key={j.id}
  value={j.id}>{j.title}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div>
                              <Label>Interviewer *</Label>
                              <Select value={form.interviewerId || 'none'} onValueChange={(v) =>        
  setForm({ ...form, interviewerId: v === 'none' ? '' : v })}>
                                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select    
  interviewer" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="none">Select interviewer</SelectItem>
                                      {employees.map(e => (
                                          <SelectItem key={e.id} value={e.id}>{e.firstName}
  {e.lastName}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <Label>Date *</Label>
                                  <Input type="date" value={form.scheduledAt} onChange={(e) => setForm({
   ...form, scheduledAt: e.target.value })} className="mt-1.5" />
                              </div>
                              <div>
                                  <Label>Time *</Label>
                                  <Input type="time" value={form.scheduledTime} onChange={(e) =>        
  setForm({ ...form, scheduledTime: e.target.value })} className="mt-1.5" />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <Label>Duration (mins)</Label>
                                  <Select value={form.duration} onValueChange={(v) => setForm({ ...form,
   duration: v })}>
                                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger> 
                                      <SelectContent>
                                          <SelectItem value="30">30 mins</SelectItem>
                                          <SelectItem value="45">45 mins</SelectItem>
                                          <SelectItem value="60">1 hour</SelectItem>
                                          <SelectItem value="90">1.5 hours</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                              <div>
                                  <Label>Type</Label>
                                  <Select value={form.type} onValueChange={(v) => setForm({ ...form,    
  type: v as InterviewType })}>
                                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger> 
                                      <SelectContent>
                                          <SelectItem value="PHONE">Phone</SelectItem>
                                          <SelectItem value="VIDEO">Video Call</SelectItem>
                                          <SelectItem value="IN_PERSON">In Person</SelectItem>
                                          <SelectItem value="TECHNICAL">Technical</SelectItem>
                                          <SelectItem value="HR">HR Round</SelectItem>
                                          <SelectItem value="FINAL">Final</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                          </div>
                          <div>
                              <Label>Location / Meeting Link</Label>
                              <Input value={form.location} onChange={(e) => setForm({ ...form, location:
   e.target.value })} placeholder="Zoom link or office address" className="mt-1.5" />
                          </div>
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() =>
  setIsCreateOpen(false)}>Cancel</Button>
                          <Button onClick={handleCreate} disabled={submitting} className="bg-violet-600 
  hover:bg-violet-700">
                              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Schedule
                          </Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>

              {/* Feedback Dialog */}
              <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                  <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                          <DialogTitle>Interview Feedback</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                          <div>
                              <Label>Rating</Label>
                              <div className="flex gap-1 mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                          key={star}
                                          type="button"
                                          onClick={() => setFeedback({ ...feedback, rating: star })}    
                                          className="p-1"
                                      >
                                          <Star
                                              className={`w-6 h-6 ${star <= feedback.rating ?
  'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                          />
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div>
                              <Label>Feedback</Label>
                              <Textarea
                                  value={feedback.text}
                                  onChange={(e) => setFeedback({ ...feedback, text: e.target.value })}  
                                  placeholder="Share your thoughts about the candidate..."
                                  rows={4}
                                  className="mt-1.5"
                              />
                          </div>
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() =>
  setIsFeedbackOpen(false)}>Cancel</Button>
                          <Button onClick={handleFeedback} disabled={submitting}
  className="bg-violet-600 hover:bg-violet-700">
                              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Save Feedback
                          </Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
          </div>
      );
  }