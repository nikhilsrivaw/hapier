'use client';                                                                                            
  import { useState } from 'react';                                                                     
  import { useCandidates, useJobs } from '@/hooks/useRecruitment';
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
      Edit2,
      Trash2,
      Loader2,
      Users,
      Mail,
      Phone,
      Briefcase,
      Sparkles,
      Linkedin,
      ExternalLink
  } from 'lucide-react';
  import Link from 'next/link';
  import { Candidate, CandidateSource } from '@/types';
  import { format } from 'date-fns';
  import { toast } from 'sonner';
  import { aiService } from '@/services/ai.service';

  const sourceStyles: Record<CandidateSource, string> = {
      DIRECT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      LINKEDIN: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      REFERRAL: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      JOB_BOARD: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      AGENCY: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      CAREER_PAGE: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
      OTHER: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };

  const initialForm = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      linkedinUrl: '',
      portfolioUrl: '',
      currentCompany: '',
      currentRole: '',
      experience: '',
      skills: '',
      source: 'DIRECT' as CandidateSource,
      resumeText: '',
      jobId: '',
  };

  export default function CandidatesPage() {
      const [sourceFilter, setSourceFilter] = useState('all');
      const [jobFilter, setJobFilter] = useState('all');
      const [search, setSearch] = useState('');
      const [isCreateOpen, setIsCreateOpen] = useState(false);
      const [form, setForm] = useState(initialForm);
      const [submitting, setSubmitting] = useState(false);
      const [parsing, setParsing] = useState(false);

      const { candidates, isLoading, createCandidate, deleteCandidate } = useCandidates(
          jobFilter !== 'all' ? { jobId: jobFilter } : sourceFilter !== 'all' ? { source: sourceFilter }
   : undefined
      );
      const { jobs } = useJobs();

      const filtered = candidates.filter(c =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );

      const handleParseResume = async () => {
          if (!form.resumeText.trim()) {
              toast.error('Paste resume text first');
              return;
          }
          setParsing(true);
          try {
              const parsed = await aiService.parseResume(form.resumeText);
              setForm({
                  ...form,
                  firstName: parsed.firstName || form.firstName,
                  lastName: parsed.lastName || form.lastName,
                  email: parsed.email || form.email,
                  phone: parsed.phone || form.phone,
                  currentRole: parsed.designation || form.currentRole,
                  skills: parsed.skills?.join(', ') || form.skills,
              });
              toast.success('Resume parsed successfully');
          } catch (e: any) {
              toast.error('Failed to parse resume');
          } finally {
              setParsing(false);
          }
      };

      const handleCreate = async () => {
          if (!form.firstName.trim() || !form.email.trim()) {
              toast.error('Name and email required');
              return;
          }
          setSubmitting(true);
          try {
              await createCandidate({
                  ...form,
                  experience: form.experience ? parseInt(form.experience) : undefined,
                  skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
                  jobId: form.jobId || undefined,
              });
              toast.success('Candidate added');
              setIsCreateOpen(false);
              setForm(initialForm);
          } catch (e: any) {
              toast.error(e.message);
          } finally {
              setSubmitting(false);
          }
      };

      const handleDelete = async (candidate: Candidate) => {
          if (!confirm(`Delete ${candidate.firstName} ${candidate.lastName}?`)) return;
          try {
              await deleteCandidate(candidate.id);
              toast.success('Candidate deleted');
          } catch (e: any) {
              toast.error(e.message);
          }
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
  dark:text-white">Candidates</h1>
                      <p className="text-gray-500 text-sm mt-1">{candidates.length} total candidates</p>
                  </div>
                  <Button onClick={() => { setForm(initialForm); setIsCreateOpen(true); }}
  className="bg-violet-600 hover:bg-violet-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Candidate
                  </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
   />
                      <Input value={search} onChange={(e) => setSearch(e.target.value)}
  placeholder="Search candidates..." className="pl-9" />
                  </div>
                  <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v);
  setJobFilter('all'); }}>
                      <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Source"       
  /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Sources</SelectItem>
                          <SelectItem value="DIRECT">Direct</SelectItem>
                          <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                          <SelectItem value="REFERRAL">Referral</SelectItem>
                          <SelectItem value="JOB_BOARD">Job Board</SelectItem>
                          <SelectItem value="AGENCY">Agency</SelectItem>
                          <SelectItem value="CAREER_PAGE">Career Page</SelectItem>
                      </SelectContent>
                  </Select>
                  <Select value={jobFilter} onValueChange={(v) => { setJobFilter(v);
  setSourceFilter('all'); }}>
                      <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Job"
  /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Jobs</SelectItem>
                          {jobs.map(j => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}   
                      </SelectContent>
                  </Select>
              </div>

              {/* Candidates List */}
              {filtered.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border
  border-gray-200 dark:border-gray-800">
                      <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />     
                      <p className="text-gray-500">No candidates found</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsCreateOpen(true)}> 
                          <Plus className="w-4 h-4 mr-2" />
                          Add first candidate
                      </Button>
                  </div>
              ) : (
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 overflow-hidden">
                      <table className="w-full">
                          <thead>
                              <tr className="border-b border-gray-100 dark:border-gray-800">
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3">Candidate</th>
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3 hidden md:table-cell">Contact</th>
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3 hidden lg:table-cell">Applied For</th>
                                  <th className="text-left text-xs font-medium text-gray-500 uppercase  
  tracking-wide px-4 py-3 hidden sm:table-cell">Source</th>
                                  <th className="text-right text-xs font-medium text-gray-500 uppercase 
  tracking-wide px-4 py-3"></th>
                              </tr>
                          </thead>
                          <tbody>
                              {filtered.map((candidate) => (
                                  <tr key={candidate.id} className="border-b border-gray-50
  dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                      <td className="px-4 py-3">
                                          <Link href={`/recruitment/candidates/${candidate.id}`}        
  className="block">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br
   from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">      
                                                      {candidate.firstName[0]}{candidate.lastName[0]}   
                                                  </div>
                                                  <div>
                                                      <p className="font-medium text-gray-900
  dark:text-white hover:text-violet-600">
                                                          {candidate.firstName} {candidate.lastName}    
                                                      </p>
                                                      <p className="text-sm
  text-gray-500">{candidate.currentRole || 'No role'}</p>
                                                  </div>
                                              </div>
                                          </Link>
                                      </td>
                                      <td className="px-4 py-3 hidden md:table-cell">
                                          <div className="space-y-1">
                                              <p className="text-sm text-gray-600 dark:text-gray-400    
  flex items-center gap-1">
                                                  <Mail className="w-3 h-3" />{candidate.email}
                                              </p>
                                              {candidate.phone && (
                                                  <p className="text-sm text-gray-500 flex items-center 
  gap-1">
                                                      <Phone className="w-3 h-3" />{candidate.phone}    
                                                  </p>
                                              )}
                                          </div>
                                      </td>
                                      <td className="px-4 py-3 hidden lg:table-cell">
                                          {candidate.applications && candidate.applications.length > 0 ?
   (
                                              <div className="flex flex-wrap gap-1">
                                                  {candidate.applications.slice(0, 2).map(app => (      
                                                      <span key={app.id} className="text-xs bg-violet-50
   dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded">
                                                          {app.job?.title}
                                                      </span>
                                                  ))}
                                                  {candidate.applications.length > 2 && (
                                                      <span className="text-xs
  text-gray-500">+{candidate.applications.length - 2}</span>
                                                  )}
                                              </div>
                                          ) : (
                                              <span className="text-sm text-gray-400">-</span>
                                          )}
                                      </td>
                                      <td className="px-4 py-3 hidden sm:table-cell">
                                          <span className={`text-xs font-medium px-2 py-1 rounded       
  ${sourceStyles[candidate.source]}`}>
                                              {candidate.source.replace('_', ' ')}
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
                                                  <DropdownMenuItem asChild>
                                                      <Link
  href={`/recruitment/candidates/${candidate.id}`}>
                                                          <ExternalLink className="w-4 h-4 mr-2" />View 
                                                      </Link>
                                                  </DropdownMenuItem>
                                                  {candidate.linkedinUrl && (
                                                      <DropdownMenuItem asChild>
                                                          <a href={candidate.linkedinUrl}
  target="_blank" rel="noopener noreferrer">
                                                              <Linkedin className="w-4 h-4 mr-2"        
  />LinkedIn
                                                          </a>
                                                      </DropdownMenuItem>
                                                  )}
                                                  <DropdownMenuItem onClick={() =>
  handleDelete(candidate)} className="text-red-600">
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
                  <DialogContent className="sm:max-w-xl max-h-[90vh]">
                      <DialogHeader>
                          <DialogTitle>Add Candidate</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                          {/* AI Resume Parser */}
                          <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200   
  dark:border-violet-800 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="w-4 h-4 text-violet-600" />
                                  <span className="text-sm font-medium text-violet-700
  dark:text-violet-300">AI Resume Parser</span>
                              </div>
                              <Textarea
                                  value={form.resumeText}
                                  onChange={(e) => setForm({ ...form, resumeText: e.target.value })}    
                                  placeholder="Paste resume text here to auto-fill fields..."
                                  rows={3}
                                  className="text-sm"
                              />
                              <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleParseResume}
                                  disabled={parsing}
                                  className="mt-2 border-violet-300 text-violet-700 hover:bg-violet-100"
                              >
                                  {parsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :        
  <Sparkles className="w-4 h-4 mr-2" />}
                                  Parse Resume
                              </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <Label>First Name *</Label>
                                  <Input value={form.firstName} onChange={(e) => setForm({ ...form,     
  firstName: e.target.value })} className="mt-1.5" />
                              </div>
                              <div>
                                  <Label>Last Name *</Label>
                                  <Input value={form.lastName} onChange={(e) => setForm({ ...form,      
  lastName: e.target.value })} className="mt-1.5" />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <Label>Email *</Label>
                                  <Input type="email" value={form.email} onChange={(e) => setForm({     
  ...form, email: e.target.value })} className="mt-1.5" />
                              </div>
                              <div>
                                  <Label>Phone</Label>
                                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone:  
  e.target.value })} className="mt-1.5" />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <Label>Current Company</Label>
                                  <Input value={form.currentCompany} onChange={(e) => setForm({ ...form,
   currentCompany: e.target.value })} className="mt-1.5" />
                              </div>
                              <div>
                                  <Label>Current Role</Label>
                                  <Input value={form.currentRole} onChange={(e) => setForm({ ...form,   
  currentRole: e.target.value })} className="mt-1.5" />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <Label>Experience (years)</Label>
                                  <Input type="number" value={form.experience} onChange={(e) =>
  setForm({ ...form, experience: e.target.value })} className="mt-1.5" />
                              </div>
                              <div>
                                  <Label>Source</Label>
                                  <Select value={form.source} onValueChange={(v) => setForm({ ...form,  
  source: v as CandidateSource })}>
                                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger> 
                                      <SelectContent>
                                          <SelectItem value="DIRECT">Direct</SelectItem>
                                          <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                                          <SelectItem value="REFERRAL">Referral</SelectItem>
                                          <SelectItem value="JOB_BOARD">Job Board</SelectItem>
                                          <SelectItem value="AGENCY">Agency</SelectItem>
                                          <SelectItem value="CAREER_PAGE">Career Page</SelectItem>      
                                          <SelectItem value="OTHER">Other</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                          </div>
                          <div>
                              <Label>LinkedIn URL</Label>
                              <Input value={form.linkedinUrl} onChange={(e) => setForm({ ...form,       
  linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." className="mt-1.5" />       
                          </div>
                          <div>
                              <Label>Skills (comma separated)</Label>
                              <Input value={form.skills} onChange={(e) => setForm({ ...form, skills:    
  e.target.value })} placeholder="React, Node.js, Python" className="mt-1.5" />
                          </div>
                          <div>
                              <Label>Apply to Job</Label>
                              <Select value={form.jobId || 'none'} onValueChange={(v) => setForm({      
  ...form, jobId: v === 'none' ? '' : v })}>
                                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select    
  job" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="none">No job</SelectItem>
                                      {jobs.filter(j => j.status === 'OPEN').map(j => (
                                          <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>    
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() =>
  setIsCreateOpen(false)}>Cancel</Button>
                          <Button onClick={handleCreate} disabled={submitting} className="bg-violet-600 
  hover:bg-violet-700">
                              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Add Candidate
                          </Button>
                      </DialogFooter>
                  </DialogContent>
              </Dialog>
          </div>
      );
  }