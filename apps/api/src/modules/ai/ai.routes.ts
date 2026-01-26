  import { Router } from 'express';
  import { AIController } from './ai.controller';
  import { authMiddleware } from '../../middleware/auth.middleware';

  const router = Router();
  const aiController = new AIController();

  // Chat assistant
  router.post('/chat', authMiddleware, aiController.chat);

  // Resume parser
  router.post('/parse-resume', authMiddleware, aiController.parseResume);

  // AI Insights & Analytics
  router.get('/insights', authMiddleware, aiController.getInsights);

  // Intelligent search
  router.post('/search', authMiddleware, aiController.intelligentSearch);

  // Smart task assignment suggestion
  router.post('/suggest-assignee', authMiddleware, aiController.suggestAssignee);

  // AI Report generator
  router.post('/generate-report', authMiddleware, aiController.generateReport);

  export default router;
