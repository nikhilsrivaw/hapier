 import { Router } from 'express';
  import { projectController } from './project.controller';
  import { authMiddleware } from '../../middleware/auth.middleware';

  const router = Router();

  router.get('/', authMiddleware, projectController.getAll);
  router.get('/:id', authMiddleware, projectController.getById);
  router.post('/', authMiddleware, projectController.create);
  router.put('/:id', authMiddleware, projectController.update);
  router.delete('/:id', authMiddleware, projectController.delete);

  export default router;
