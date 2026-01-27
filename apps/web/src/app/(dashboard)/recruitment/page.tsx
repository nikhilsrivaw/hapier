'use client';                                                                                         
  
  import { useRecruitmentAnalytics, useJobs, useInterviews } from '@/hooks/useRecruitment';
  import { Button } from '@/components/ui/button';
  import {
      Briefcase,
      Users,
      UserCheck,
      Clock,
      Plus,
      ArrowRight,
      Loader2,
      Calendar
  } from 'lucide-react';
  import Link from 'next/link';
  import { format } from 'date-fns';

  export default function RecruitmentPage() {
      const { analytics, isLoading: analyticsLoading } = useRecruitmentAnalytics();
      const { jobs, isLoading: jobsLoading } = useJobs({ status: 'OPEN' });
      const { interviews, isLoading: interviewsLoading } = useInterviews({ status: 'SCHEDULED' });      

      const isLoading = analyticsLoading || jobsLoading || interviewsLoading;

      if (isLoading) {
          return (
              <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
              </div>
          );
      }

      const upcomingInterviews = interviews
          .filter(i => new Date(i.scheduledAt) >= new Date())
          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())        
          .slice(0, 5);

      const stats = [
          { label: 'Open Jobs', value: analytics?.overview.openJobs || 0, icon: Briefcase, color:       
  'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400' },
          { label: 'Total Candidates', value: analytics?.overview.totalCandidates || 0, icon: Users,    
  color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' },
          { label: 'Hired (30d)', value: analytics?.overview.recentHires || 0, icon: UserCheck, color:  
  'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' },
          { label: 'Avg. Days to Hire', value: analytics?.overview.avgTimeToHire || 0, icon: Clock,     
  color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400' },
      ];

      return (
          <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">      
                  <div>
                      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h1>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your hiring    
  pipeline</p>
                  </div>
                  <Link href="/recruitment/jobs">
                      <Button className="bg-violet-600 hover:bg-violet-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Post Job
                      </Button>
                  </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                      <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-xl p-5 border  
  border-gray-200 dark:border-gray-800">
                          <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center
  justify-center mb-3`}>
                              <stat.icon className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-semibold text-gray-900
  dark:text-white">{stat.value}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>      
                      </div>
                  ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                  {/* Pipeline */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-5">
                      <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Pipeline</h2>    
                      <div className="space-y-3">
                          {[
                              { stage: 'APPLIED', label: 'Applied', color: 'bg-blue-500' },
                              { stage: 'SCREENING', label: 'Screening', color: 'bg-yellow-500' },       
                              { stage: 'INTERVIEW', label: 'Interview', color: 'bg-purple-500' },       
                              { stage: 'OFFER', label: 'Offer', color: 'bg-orange-500' },
                              { stage: 'HIRED', label: 'Hired', color: 'bg-green-500' },
                          ].map((item) => {
                              const count = analytics?.pipeline?.[item.stage as keyof typeof
  analytics.pipeline] || 0;
                              const total = analytics?.overview.totalApplications || 1;
                              const pct = Math.round((count / total) * 100) || 0;

                              return (
                                  <div key={item.stage} className="flex items-center gap-3">
                                      <div className="w-20 text-sm text-gray-600
  dark:text-gray-400">{item.label}</div>
                                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800
  rounded-full overflow-hidden">
                                          <div className={`h-full ${item.color} rounded-full`} style={{ 
  width: `${pct}%` }} />
                                      </div>
                                      <div className="w-8 text-sm font-medium text-gray-900
  dark:text-white text-right">{count}</div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* Upcoming Interviews */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-5">
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="font-semibold text-gray-900 dark:text-white">Upcoming
  Interviews</h2>
                          <Link href="/recruitment/interviews" className="text-sm text-violet-600       
  hover:text-violet-700 flex items-center gap-1">
                              View all <ArrowRight className="w-3 h-3" />
                          </Link>
                      </div>
                      {upcomingInterviews.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-8">No upcoming
  interviews</p>
                      ) : (
                          <div className="space-y-3">
                              {upcomingInterviews.map((interview) => (
                                  <div key={interview.id} className="flex items-center justify-between  
  py-2">
                                      <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-full bg-gray-100
  dark:bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-600
  dark:text-gray-300">

  {interview.candidate?.firstName?.[0]}{interview.candidate?.lastName?.[0]}
                                          </div>
                                          <div>
                                              <p className="text-sm font-medium text-gray-900
  dark:text-white">
                                                  {interview.candidate?.firstName}
  {interview.candidate?.lastName}
                                              </p>
                                              <p className="text-xs
  text-gray-500">{interview.job?.title}</p>
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-sm text-gray-900
  dark:text-white">{format(new Date(interview.scheduledAt), 'MMM d')}</p>
                                          <p className="text-xs text-gray-500">{format(new
  Date(interview.scheduledAt), 'h:mm a')}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>

              {/* Open Jobs */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200
  dark:border-gray-800 p-5">
                  <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-gray-900 dark:text-white">Open Positions</h2>   
                      <Link href="/recruitment/jobs" className="text-sm text-violet-600
  hover:text-violet-700 flex items-center gap-1">
                          View all <ArrowRight className="w-3 h-3" />
                      </Link>
                  </div>
                  {jobs.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-8">No open positions</p>       
                  ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {jobs.slice(0, 6).map((job) => (
                              <Link
                                  key={job.id}
                                  href={`/recruitment/jobs/${job.id}`}
                                  className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 
  hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
                              >
                                  <h3 className="font-medium text-gray-900
  dark:text-white">{job.title}</h3>
                                  <p className="text-sm text-gray-500 mt-1">{job.department?.name || 'Nodepartment'}</p>
                                  <div className="flex items-center gap-2 mt-3">
                                      <span className="text-xs bg-violet-100 dark:bg-violet-900/50      
  text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded">
                                          {job._count?.applications || 0} applicants
                                      </span>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      );
  }