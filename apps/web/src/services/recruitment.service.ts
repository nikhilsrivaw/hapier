 import api from '@/lib/api';                                                                            import { Job, Candidate, Application, Interview, CandidateNote, RecruitmentAnalytics } from '@/types';                                                                                                        
  export const recruitmentService = {
      // ==================== JOBS ====================
      async getJobs(filters?: { status?: string; departmentId?: string }): Promise<Job[]> {
          const params = new URLSearchParams();
          if (filters?.status) params.append('status', filters.status);
          if (filters?.departmentId) params.append('departmentId', filters.departmentId);
          const query = params.toString();
          return api.get(`/recruitment/jobs${query ? `?${query}` : ''}`);
      },

      async getJobById(id: string): Promise<Job> {
          return api.get(`/recruitment/jobs/${id}`);
      },

      async createJob(data: Partial<Job>): Promise<Job> {
          return api.post('/recruitment/jobs', data);
      },

      async updateJob(id: string, data: Partial<Job>): Promise<Job> {
          return api.put(`/recruitment/jobs/${id}`, data);
      },

      async deleteJob(id: string): Promise<void> {
          return api.delete(`/recruitment/jobs/${id}`);
      },

      // ==================== CANDIDATES ====================
      async getCandidates(filters?: { jobId?: string; source?: string }): Promise<Candidate[]> {        
          const params = new URLSearchParams();
          if (filters?.jobId) params.append('jobId', filters.jobId);
          if (filters?.source) params.append('source', filters.source);
          const query = params.toString();
          return api.get(`/recruitment/candidates${query ? `?${query}` : ''}`);
      },

      async getCandidateById(id: string): Promise<Candidate> {
          return api.get(`/recruitment/candidates/${id}`);
      },

      async createCandidate(data: Partial<Candidate> & { jobId?: string }): Promise<Candidate> {        
          return api.post('/recruitment/candidates', data);
      },

      async updateCandidate(id: string, data: Partial<Candidate>): Promise<Candidate> {
          return api.put(`/recruitment/candidates/${id}`, data);
      },

      async deleteCandidate(id: string): Promise<void> {
          return api.delete(`/recruitment/candidates/${id}`);
      },

      // ==================== APPLICATIONS ====================
      async getApplications(filters?: { jobId?: string; stage?: string }): Promise<Application[]> {     
          const params = new URLSearchParams();
          if (filters?.jobId) params.append('jobId', filters.jobId);
          if (filters?.stage) params.append('stage', filters.stage);
          const query = params.toString();
          return api.get(`/recruitment/applications${query ? `?${query}` : ''}`);
      },

      async createApplication(data: { candidateId: string; jobId: string }): Promise<Application> {     
          return api.post('/recruitment/applications', data);
      },

      async updateApplicationStage(id: string, stage: string, rejectionReason?: string):
  Promise<Application> {
          return api.patch(`/recruitment/applications/${id}/stage`, { stage, rejectionReason });        
      },

      // ==================== INTERVIEWS ====================
      async getInterviews(filters?: { candidateId?: string; jobId?: string; status?: string }):
  Promise<Interview[]> {
          const params = new URLSearchParams();
          if (filters?.candidateId) params.append('candidateId', filters.candidateId);
          if (filters?.jobId) params.append('jobId', filters.jobId);
          if (filters?.status) params.append('status', filters.status);
          const query = params.toString();
          return api.get(`/recruitment/interviews${query ? `?${query}` : ''}`);
      },

      async createInterview(data: {
          candidateId: string;
          jobId: string;
          interviewerId: string;
          scheduledAt: string;
          duration?: number;
          type?: string;
          location?: string;
      }): Promise<Interview> {
          return api.post('/recruitment/interviews', data);
      },

      async updateInterview(id: string, data: Partial<Interview>): Promise<Interview> {
          return api.put(`/recruitment/interviews/${id}`, data);
      },

      async addInterviewFeedback(id: string, feedback: string, rating: number): Promise<Interview> {    
          return api.patch(`/recruitment/interviews/${id}/feedback`, { feedback, rating });
      },

      // ==================== CANDIDATE NOTES ====================
      async addCandidateNote(candidateId: string, content: string): Promise<CandidateNote> {
          return api.post(`/recruitment/candidates/${candidateId}/notes`, { content });
      },

      // ==================== ANALYTICS ====================
      async getAnalytics(): Promise<RecruitmentAnalytics> {
          return api.get('/recruitment/analytics');
      }
  };