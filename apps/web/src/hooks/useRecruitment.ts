
  import { useState, useEffect, useCallback } from 'react';                                               import { recruitmentService } from '@/services/recruitment.service';
  import { Job, Candidate, Application, Interview, RecruitmentAnalytics } from '@/types';               
  
  // ==================== JOBS HOOK ====================
  export function useJobs(filters?: { status?: string; departmentId?: string }) {
      const [jobs, setJobs] = useState<Job[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchJobs = useCallback(async () => {
          setIsLoading(true);
          try {
              const data = await recruitmentService.getJobs(filters);
              setJobs(data);
              setError(null);
          } catch (err: any) {
              setError(err.message || 'Failed to fetch jobs');
          } finally {
              setIsLoading(false);
          }
      }, [filters?.status, filters?.departmentId]);

      useEffect(() => {
          fetchJobs();
      }, [fetchJobs]);

      const createJob = async (data: Partial<Job>) => {
          const newJob = await recruitmentService.createJob(data);
          setJobs(prev => [newJob, ...prev]);
          return newJob;
      };

      const updateJob = async (id: string, data: Partial<Job>) => {
          const updated = await recruitmentService.updateJob(id, data);
          setJobs(prev => prev.map(j => j.id === id ? updated : j));
          return updated;
      };

      const deleteJob = async (id: string) => {
          await recruitmentService.deleteJob(id);
          setJobs(prev => prev.filter(j => j.id !== id));
      };

      return { jobs, isLoading, error, refetch: fetchJobs, createJob, updateJob, deleteJob };
  }

  // ==================== CANDIDATES HOOK ====================
  export function useCandidates(filters?: { jobId?: string; source?: string }) {
      const [candidates, setCandidates] = useState<Candidate[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchCandidates = useCallback(async () => {
          setIsLoading(true);
          try {
              const data = await recruitmentService.getCandidates(filters);
              setCandidates(data);
              setError(null);
          } catch (err: any) {
              setError(err.message || 'Failed to fetch candidates');
          } finally {
              setIsLoading(false);
          }
      }, [filters?.jobId, filters?.source]);

      useEffect(() => {
          fetchCandidates();
      }, [fetchCandidates]);

      const createCandidate = async (data: Partial<Candidate> & { jobId?: string }) => {
          const newCandidate = await recruitmentService.createCandidate(data);
          setCandidates(prev => [newCandidate, ...prev]);
          return newCandidate;
      };

      const updateCandidate = async (id: string, data: Partial<Candidate>) => {
          const updated = await recruitmentService.updateCandidate(id, data);
          setCandidates(prev => prev.map(c => c.id === id ? updated : c));
          return updated;
      };

      const deleteCandidate = async (id: string) => {
          await recruitmentService.deleteCandidate(id);
          setCandidates(prev => prev.filter(c => c.id !== id));
      };

      return { candidates, isLoading, error, refetch: fetchCandidates, createCandidate, updateCandidate,
   deleteCandidate };
  }

  // ==================== APPLICATIONS HOOK ====================
  export function useApplications(filters?: { jobId?: string; stage?: string }) {
      const [applications, setApplications] = useState<Application[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchApplications = useCallback(async () => {
          setIsLoading(true);
          try {
              const data = await recruitmentService.getApplications(filters);
              setApplications(data);
              setError(null);
          } catch (err: any) {
              setError(err.message || 'Failed to fetch applications');
          } finally {
              setIsLoading(false);
          }
      }, [filters?.jobId, filters?.stage]);

      useEffect(() => {
          fetchApplications();
      }, [fetchApplications]);

      const updateStage = async (id: string, stage: string, rejectionReason?: string) => {
          const updated = await recruitmentService.updateApplicationStage(id, stage, rejectionReason);  
          setApplications(prev => prev.map(a => a.id === id ? updated : a));
          return updated;
      };

      return { applications, isLoading, error, refetch: fetchApplications, updateStage };
  }

  // ==================== INTERVIEWS HOOK ====================
  export function useInterviews(filters?: { candidateId?: string; jobId?: string; status?: string }) {  
      const [interviews, setInterviews] = useState<Interview[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchInterviews = useCallback(async () => {
          setIsLoading(true);
          try {
              const data = await recruitmentService.getInterviews(filters);
              setInterviews(data);
              setError(null);
          } catch (err: any) {
              setError(err.message || 'Failed to fetch interviews');
          } finally {
              setIsLoading(false);
          }
      }, [filters?.candidateId, filters?.jobId, filters?.status]);

      useEffect(() => {
          fetchInterviews();
      }, [fetchInterviews]);

      const createInterview = async (data: {
          candidateId: string;
          jobId: string;
          interviewerId: string;
          scheduledAt: string;
          duration?: number;
          type?: string;
          location?: string;
      }) => {
          const newInterview = await recruitmentService.createInterview(data);
          setInterviews(prev => [newInterview, ...prev]);
          return newInterview;
      };

      const updateInterview = async (id: string, data: Partial<Interview>) => {
          const updated = await recruitmentService.updateInterview(id, data);
          setInterviews(prev => prev.map(i => i.id === id ? updated : i));
          return updated;
      };

      const addFeedback = async (id: string, feedback: string, rating: number) => {
          const updated = await recruitmentService.addInterviewFeedback(id, feedback, rating);
          setInterviews(prev => prev.map(i => i.id === id ? updated : i));
          return updated;
      };

      return { interviews, isLoading, error, refetch: fetchInterviews, createInterview, updateInterview,
   addFeedback };
  }

  // ==================== ANALYTICS HOOK ====================
  export function useRecruitmentAnalytics() {
      const [analytics, setAnalytics] = useState<RecruitmentAnalytics | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const fetchAnalytics = useCallback(async () => {
          setIsLoading(true);
          try {
              const data = await recruitmentService.getAnalytics();
              setAnalytics(data);
              setError(null);
          } catch (err: any) {
              setError(err.message || 'Failed to fetch analytics');
          } finally {
              setIsLoading(false);
          }
      }, []);

      useEffect(() => {
          fetchAnalytics();
      }, [fetchAnalytics]);

      return { analytics, isLoading, error, refetch: fetchAnalytics };
  }
