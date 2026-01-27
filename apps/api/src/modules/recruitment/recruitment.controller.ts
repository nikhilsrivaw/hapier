import { Request, Response, NextFunction } from 'express';                                              import { RecruitmentService } from './recruitment.service';
                                                                                                        
  interface AuthRequest extends Request {
      user?: {
          id: string;
          organizationId: string;
          email: string;
          role: string;
      };
  }

  export class RecruitmentController {
      private service = new RecruitmentService();

      // ==================== JOBS ====================
      getJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const { status, departmentId } = req.query;
              const jobs = await this.service.getJobs(orgId, {
                  status: status as string,
                  departmentId: departmentId as string
              });
              res.json(jobs);
          } catch (error) {
              next(error);
          }
      };

      getJobById = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const job = await this.service.getJobById(req.params.id, orgId);
              res.json(job);
          } catch (error) {
              next(error);
          }
      };

      createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const job = await this.service.createJob(req.body, orgId);
              res.status(201).json(job);
          } catch (error) {
              next(error);
          }
      };

      updateJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const job = await this.service.updateJob(req.params.id, req.body, orgId);
              res.json(job);
          } catch (error) {
              next(error);
          }
      };

      deleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              await this.service.deleteJob(req.params.id, orgId);
              res.json({ message: 'Job deleted successfully' });
          } catch (error) {
              next(error);
          }
      };

      // ==================== CANDIDATES ====================
      getCandidates = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const { jobId, source } = req.query;
              const candidates = await this.service.getCandidates(orgId, {
                  jobId: jobId as string,
                  source: source as string
              });
              res.json(candidates);
          } catch (error) {
              next(error);
          }
      };

      getCandidateById = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const candidate = await this.service.getCandidateById(req.params.id, orgId);
              res.json(candidate);
          } catch (error) {
              next(error);
          }
      };

      createCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const candidate = await this.service.createCandidate(req.body, orgId);
              res.status(201).json(candidate);
          } catch (error) {
              next(error);
          }
      };

      updateCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const candidate = await this.service.updateCandidate(req.params.id, req.body, orgId);     
              res.json(candidate);
          } catch (error) {
              next(error);
          }
      };

      deleteCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              await this.service.deleteCandidate(req.params.id, orgId);
              res.json({ message: 'Candidate deleted successfully' });
          } catch (error) {
              next(error);
          }
      };

      // ==================== APPLICATIONS ====================
      getApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const { jobId, stage } = req.query;
              const applications = await this.service.getApplications(orgId, {
                  jobId: jobId as string,
                  stage: stage as string
              });
              res.json(applications);
          } catch (error) {
              next(error);
          }
      };

      createApplication = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const application = await this.service.createApplication(req.body, orgId);
              res.status(201).json(application);
          } catch (error) {
              next(error);
          }
      };

      updateApplicationStage = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const { stage, rejectionReason } = req.body;
              const application = await this.service.updateApplicationStage(
                  req.params.id,
                  stage,
                  orgId,
                  rejectionReason
              );
              res.json(application);
          } catch (error) {
              next(error);
          }
      };

      // ==================== INTERVIEWS ====================
      getInterviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const { candidateId, jobId, status } = req.query;
              const interviews = await this.service.getInterviews(orgId, {
                  candidateId: candidateId as string,
                  jobId: jobId as string,
                  status: status as string
              });
              res.json(interviews);
          } catch (error) {
              next(error);
          }
      };

      createInterview = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const interview = await this.service.createInterview(req.body, orgId);
              res.status(201).json(interview);
          } catch (error) {
              next(error);
          }
      };

      updateInterview = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const interview = await this.service.updateInterview(req.params.id, req.body, orgId);     
              res.json(interview);
          } catch (error) {
              next(error);
          }
      };

      addInterviewFeedback = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const { feedback, rating } = req.body;
              const interview = await this.service.addInterviewFeedback(
                  req.params.id,
                  feedback,
                  rating,
                  orgId
              );
              res.json(interview);
          } catch (error) {
              next(error);
          }
      };

      // ==================== CANDIDATE NOTES ====================
      addCandidateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const userId = req.user!.id;
              const { content } = req.body;
              const note = await this.service.addCandidateNote(
                  req.params.id,
                  content,
                  userId,
                  orgId
              );
              res.status(201).json(note);
          } catch (error) {
              next(error);
          }
      };

      // ==================== ANALYTICS ====================
      getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const analytics = await this.service.getAnalytics(orgId);
              res.json(analytics);
          } catch (error) {
              next(error);
          }
      };
  }
