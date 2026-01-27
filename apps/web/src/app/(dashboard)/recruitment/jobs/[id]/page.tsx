'use client';

  import { useState, useEffect } from 'react';
  import { useParams, useRouter } from 'next/navigation';
  import { recruitmentService } from '@/services/recruitment.service';
  import { Button } from '@/components/ui/button';
  import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
  } from '@/components/ui/select';
  import {
      ArrowLeft,
      Loader2,
      MapPin,
      Briefcase,
      Clock,
      Users,
      DollarSign,
      Calendar,
      ChevronRight
  } from 'lucide-react';
  import Link from 'next/link';
  import { Job, Application, ApplicationStage } from '@/types';
  import { format } from 'date-fns';
  import { toast } from 'sonner';

  const stages: { key: ApplicationStage; label: string; color: string }[] = [
      { key: 'APPLIED', label: 'Applied', color: 'bg-blue-500' },
      { key: 'SCREENING', label: 'Screening', color: 'bg-yellow-500' },
      { key: 'INTERVIEW', label: 'Interview', color: 'bg-purple-500' },
      { key: 'OFFER', label: 'Offer', color: 'bg-orange-500' },
      { key: 'HIRED', label: 'Hired', color: 'bg-green-500' },
      { key: 'REJECTED', label: 'Rejected', color: 'bg-red-500' },
  ];

  export default function JobDetailPage() {
      const params = useParams();
      const router = useRouter();
      const [job, setJob] = useState<Job | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
          const fetchJob = async () => {
              try {
                  const data = await recruitmentService.getJobById(params.id as string);
                  setJob(data);
              } catch (e) {
                  toast.error('Failed to load job');
                  router.push('/recruitment/jobs');
              } finally {
                  setLoading(false);
              }
          };
          fetchJob();
      }, [params.id, router]);

      const handleStageChange = async (applicationId: string, newStage: string) => {
          try {
              await recruitmentService.updateApplicationStage(applicationId, newStage);
              // Refresh job data
              const data = await recruitmentService.getJobById(params.id as string);
              setJob(data);
              toast.success('Stage updated');
          } catch (e: any) {
              toast.error(e.message);
          }
      };

      if (loading) {
          return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6     
  animate-spin text-violet-600" /></div>;
      }

      if (!job) return null;

      const applicationsByStage = stages.map(stage => ({
          ...stage,
          applications: job.applications?.filter(a => a.stage === stage.key) || []
      }));

      return (
          <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                  <div>
                      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm  
  text-gray-500 hover:text-gray-700 mb-2">
                          <ArrowLeft className="w-4 h-4" />
                          Back to Jobs
                      </button>
                      <h1 className="text-2xl font-semibold text-gray-900
  dark:text-white">{job.title}</h1>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">    
                          {job.department && (
                              <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.department.name}
                              </span>
                          )}
                          {job.location && (
                              <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                              </span>
                          )}
                          <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.applications?.length || 0} applicants
                          </span>
                          <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                          </span>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                          job.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                          job.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                          {job.status}
                      </span>
                  </div>
              </div>

              {/* Job Info Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Job Type</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white
  mt-1">{job.jobType.replace('_', ' ')}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Experience</p>       
                      <p className="text-sm font-medium text-gray-900 dark:text-white
  mt-1">{job.experienceLevel} Level</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Salary Range</p>     
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {job.salaryMin && job.salaryMax
                              ? `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax /
  100000).toFixed(1)}L`
                              : 'Not specified'}
                      </p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Applicants</p>       
                      <p className="text-sm font-medium text-gray-900 dark:text-white
  mt-1">{job.applications?.length || 0}</p>
                  </div>
              </div>

              {/* Description */}
              {job.description && (
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-5">
                      <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Description</h2> 
                      <p className="text-sm text-gray-600 dark:text-gray-400
  whitespace-pre-wrap">{job.description}</p>
                  </div>
              )}

              {/* Pipeline */}
              <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Applicant
  Pipeline</h2>
                  <div className="grid lg:grid-cols-6 gap-4">
                      {applicationsByStage.map((stage) => (
                          <div key={stage.key} className="bg-white dark:bg-gray-900 rounded-xl border   
  border-gray-200 dark:border-gray-800 p-3">
                              <div className="flex items-center gap-2 mb-3">
                                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                  <span className="text-sm font-medium text-gray-700
  dark:text-gray-300">{stage.label}</span>
                                  <span className="text-xs text-gray-400
  ml-auto">{stage.applications.length}</span>
                              </div>
                              <div className="space-y-2">
                                  {stage.applications.map((app) => (
                                      <div key={app.id} className="p-2 bg-gray-50 dark:bg-gray-800      
  rounded-lg">
                                          <Link href={`/recruitment/candidates/${app.candidate?.id}`}   
  className="block">
                                              <p className="text-sm font-medium text-gray-900
  dark:text-white hover:text-violet-600">
                                                  {app.candidate?.firstName} {app.candidate?.lastName}  
                                              </p>
                                          </Link>
                                          <Select
                                              value={app.stage}
                                              onValueChange={(v) => handleStageChange(app.id, v)}       
                                          >
                                              <SelectTrigger className="h-7 text-xs mt-2">
                                                  <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                  {stages.map(s => (
                                                      <SelectItem key={s.key}
  value={s.key}>{s.label}</SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                      </div>
                                  ))}
                                  {stage.applications.length === 0 && (
                                      <p className="text-xs text-gray-400 text-center py-4">No
  candidates</p>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }