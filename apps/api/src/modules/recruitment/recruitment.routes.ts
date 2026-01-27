 import { Router } from 'express';                                                                     
  import { RecruitmentController } from './recruitment.controller';
  import { authMiddleware } from '../../middleware/auth.middleware';

  const router = Router();
  const controller = new RecruitmentController();

  // Jobs
  router.get('/jobs', authMiddleware, controller.getJobs);
  router.get('/jobs/:id', authMiddleware, controller.getJobById);
  router.post('/jobs', authMiddleware, controller.createJob);
  router.put('/jobs/:id', authMiddleware, controller.updateJob);
  router.delete('/jobs/:id', authMiddleware, controller.deleteJob);

  // Candidates
  router.get('/candidates', authMiddleware, controller.getCandidates);
  router.get('/candidates/:id', authMiddleware, controller.getCandidateById);
  router.post('/candidates', authMiddleware, controller.createCandidate);
  router.put('/candidates/:id', authMiddleware, controller.updateCandidate);
  router.delete('/candidates/:id', authMiddleware, controller.deleteCandidate);

  // Applications
  router.get('/applications', authMiddleware, controller.getApplications);
  router.post('/applications', authMiddleware, controller.createApplication);
  router.patch('/applications/:id/stage', authMiddleware, controller.updateApplicationStage);

  // Interviews
  router.get('/interviews', authMiddleware, controller.getInterviews);
  router.post('/interviews', authMiddleware, controller.createInterview);
  router.put('/interviews/:id', authMiddleware, controller.updateInterview);
  router.patch('/interviews/:id/feedback', authMiddleware, controller.addInterviewFeedback);

  // Candidate Notes
  router.post('/candidates/:id/notes', authMiddleware, controller.addCandidateNote);

  // Analytics
  router.get('/analytics', authMiddleware, controller.getAnalytics);

  export default router;