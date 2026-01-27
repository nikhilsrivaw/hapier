'use client';                                                                                            
  import { useState, useEffect } from 'react';                                                          
  import { useParams, useRouter } from 'next/navigation';
  import { recruitmentService } from '@/services/recruitment.service';
  import { Button } from '@/components/ui/button';
  import { Textarea } from '@/components/ui/textarea';
  import {
      ArrowLeft,
      Loader2,
      Mail,
      Phone,
      Linkedin,
      Globe,
      Briefcase,
      Calendar,
      Clock,
      Star,
      Send,
      MessageSquare,
      Video,
      User
  } from 'lucide-react';
  import { Candidate, ApplicationStage } from '@/types';
  import { format } from 'date-fns';
  import { toast } from 'sonner';

  const stageStyles: Record<ApplicationStage, string> = {
      APPLIED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      SCREENING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      INTERVIEW: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      OFFER: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      HIRED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      WITHDRAWN: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  export default function CandidateDetailPage() {
      const params = useParams();
      const router = useRouter();
      const [candidate, setCandidate] = useState<Candidate | null>(null);
      const [loading, setLoading] = useState(true);
      const [note, setNote] = useState('');
      const [submittingNote, setSubmittingNote] = useState(false);

      const fetchCandidate = async () => {
          try {
              const data = await recruitmentService.getCandidateById(params.id as string);
              setCandidate(data);
          } catch (e) {
              toast.error('Failed to load candidate');
              router.push('/recruitment/candidates');
          } finally {
              setLoading(false);
          }
      };

      useEffect(() => {
          fetchCandidate();
      }, [params.id]);

      const handleAddNote = async () => {
          if (!note.trim()) return;
          setSubmittingNote(true);
          try {
              await recruitmentService.addCandidateNote(params.id as string, note);
              setNote('');
              await fetchCandidate();
              toast.success('Note added');
          } catch (e: any) {
              toast.error(e.message);
          } finally {
              setSubmittingNote(false);
          }
      };

      if (loading) {
          return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6     
  animate-spin text-violet-600" /></div>;
      }

      if (!candidate) return null;

      return (
          <div className="space-y-6">
              {/* Header */}
              <div>
                  <button onClick={() => router.back()} className="flex items-center gap-1 text-sm      
  text-gray-500 hover:text-gray-700 mb-3">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                  </button>
                  <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500
  to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                          {candidate.firstName[0]}{candidate.lastName[0]}
                      </div>
                      <div className="flex-1">
                          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                              {candidate.firstName} {candidate.lastName}
                          </h1>
                          <p className="text-gray-500">{candidate.currentRole || 'No role'}
  {candidate.currentCompany && `at ${candidate.currentCompany}`}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                              <a href={`mailto:${candidate.email}`} className="flex items-center gap-1  
  text-sm text-gray-600 hover:text-violet-600">
                                  <Mail className="w-4 h-4" />{candidate.email}
                              </a>
                              {candidate.phone && (
                                  <span className="flex items-center gap-1 text-sm text-gray-600">      
                                      <Phone className="w-4 h-4" />{candidate.phone}
                                  </span>
                              )}
                              {candidate.linkedinUrl && (
                                  <a href={candidate.linkedinUrl} target="_blank" rel="noopener
  noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                      <Linkedin className="w-4 h-4" />LinkedIn
                                  </a>
                              )}
                              {candidate.portfolioUrl && (
                                  <a href={candidate.portfolioUrl} target="_blank" rel="noopener        
  noreferrer" className="flex items-center gap-1 text-sm text-gray-600 hover:text-violet-600">
                                      <Globe className="w-4 h-4" />Portfolio
                                  </a>
                              )}
                          </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded
  ${stageStyles[candidate.source as unknown as ApplicationStage] || 'bg-gray-100 text-gray-600'}`}>     
                          {candidate.source.replace('_', ' ')}
                      </span>
                  </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left - Info */}
                  <div className="lg:col-span-2 space-y-6">
                      {/* Details */}
                      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200       
  dark:border-gray-800 p-5">
                          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h2> 
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                  <p className="text-gray-500">Experience</p>
                                  <p className="font-medium text-gray-900
  dark:text-white">{candidate.experience ? `${candidate.experience} years` : 'Not specified'}</p>       
                              </div>
                              <div>
                                  <p className="text-gray-500">Added</p>
                                  <p className="font-medium text-gray-900 dark:text-white">{format(new  
  Date(candidate.createdAt), 'MMM d, yyyy')}</p>
                              </div>
                          </div>
                          {candidate.skills && candidate.skills.length > 0 && (
                              <div className="mt-4">
                                  <p className="text-gray-500 text-sm mb-2">Skills</p>
                                  <div className="flex flex-wrap gap-2">
                                      {candidate.skills.map((skill, i) => (
                                          <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 
  text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                              {skill}
                                          </span>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* Applications */}
                      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200       
  dark:border-gray-800 p-5">
                          <h2 className="font-semibold text-gray-900 dark:text-white
  mb-4">Applications</h2>
                          {candidate.applications && candidate.applications.length > 0 ? (
                              <div className="space-y-3">
                                  {candidate.applications.map((app) => (
                                      <div key={app.id} className="flex items-center justify-between p-3
   bg-gray-50 dark:bg-gray-800 rounded-lg">
                                          <div className="flex items-center gap-3">
                                              <Briefcase className="w-4 h-4 text-gray-400" />
                                              <div>
                                                  <p className="font-medium text-gray-900
  dark:text-white">{app.job?.title}</p>
                                                  <p className="text-xs text-gray-500">Applied
  {format(new Date(app.appliedAt), 'MMM d, yyyy')}</p>
                                              </div>
                                          </div>
                                          <span className={`text-xs font-medium px-2 py-1 rounded       
  ${stageStyles[app.stage]}`}>
                                              {app.stage}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-gray-500 text-sm text-center py-4">No applications     
  yet</p>
                          )}
                      </div>

                      {/* Interviews */}
                      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200       
  dark:border-gray-800 p-5">
                          <h2 className="font-semibold text-gray-900 dark:text-white
  mb-4">Interviews</h2>
                          {candidate.interviews && candidate.interviews.length > 0 ? (
                              <div className="space-y-3">
                                  {candidate.interviews.map((interview) => (
                                      <div key={interview.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                          <div className="flex items-center justify-between mb-2">      
                                              <div className="flex items-center gap-2">
                                                  <Video className="w-4 h-4 text-gray-400" />
                                                  <span className="font-medium text-gray-900 dark:text-white">{interview.type}</span>
                                              </div>
                                              <span className={`text-xs px-2 py-0.5 rounded ${
                                                  interview.status === 'COMPLETED' ? 'bg-green-100     text-green-700' :
                                                  interview.status === 'SCHEDULED' ? 'bg-blue-100    text-blue-700' :
                                                  'bg-gray-100 text-gray-700'
                                              }`}>
                                                  {interview.status}
                                              </span>
                                          </div>
                                          <div className="flex items-center gap-4 text-xs
  text-gray-500">
                                              <span className="flex items-center gap-1">
                                                  <Calendar className="w-3 h-3" />
                                                  {format(new Date(interview.scheduledAt), 'MMM d,yyyy')}
                                              </span>
                                              <span className="flex items-center gap-1">
                                                  <Clock className="w-3 h-3" />
                                                  {format(new Date(interview.scheduledAt), 'h:mm a')}   
                                              </span>
                                              <span className="flex items-center gap-1">
                                                  <User className="w-3 h-3" />
                                                  {interview.interviewer?.firstName}
  {interview.interviewer?.lastName}
                                              </span>
                                          </div>
                                          {interview.feedback && (
                                              <div className="mt-2 pt-2 border-t border-gray-200        
  dark:border-gray-700">
                                                  <div className="flex items-center gap-1 mb-1">        
                                                      {[1, 2, 3, 4, 5].map((star) => (
                                                          <Star key={star} className={`w-3 h-3 ${star <=
   (interview.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                      ))}
                                                  </div>
                                                  <p className="text-sm text-gray-600
  dark:text-gray-400">{interview.feedback}</p>
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-gray-500 text-sm text-center py-4">No interviews       
  scheduled</p>
                          )}
                      </div>
                  </div>

                  {/* Right - Notes */}
                  <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200       
  dark:border-gray-800 p-5">
                          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex
  items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Notes
                          </h2>

                          {/* Add Note */}
                          <div className="mb-4">
                              <Textarea
                                  value={note}
                                  onChange={(e) => setNote(e.target.value)}
                                  placeholder="Add a note..."
                                  rows={3}
                                  className="text-sm"
                              />
                              <Button
                                  onClick={handleAddNote}
                                  disabled={submittingNote || !note.trim()}
                                  size="sm"
                                  className="mt-2 bg-violet-600 hover:bg-violet-700"
                              >
                                  {submittingNote ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
  <Send className="w-4 h-4 mr-2" />}
                                  Add Note
                              </Button>
                          </div>

                          {/* Notes List */}
                          {candidate.notes && candidate.notes.length > 0 ? (
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                  {candidate.notes.map((n) => (
                                      <div key={n.id} className="p-3 bg-gray-50 dark:bg-gray-800        
  rounded-lg">
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-medium text-gray-900        
  dark:text-white">
                                                  {n.author?.firstName} {n.author?.lastName}
                                              </span>
                                              <span className="text-xs text-gray-400">
                                                  {format(new Date(n.createdAt), 'MMM d, h:mm a')}      
                                              </span>
                                          </div>
                                          <p className="text-sm text-gray-600
  dark:text-gray-400">{n.content}</p>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-gray-500 text-sm text-center py-4">No notes yet</p>    
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
  }
