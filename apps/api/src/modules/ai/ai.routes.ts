  import { Router } from 'express';
  import { AIController } from './ai.controller';
  import { authMiddleware } from '../../middleware/auth.middleware';

  const router = Router();
  const aiController = new AIController();

  router.post('/chat', authMiddleware, aiController.chat);

  export default router;