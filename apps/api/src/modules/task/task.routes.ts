 import { Router } from 'express';
  import { taskController } from './task.controller';
  import { authMiddleware } from '../../middleware/auth.middleware';

  const router = Router();

  router.get('/', authMiddleware, taskController.getAll);
  router.get('/:id', authMiddleware, taskController.getById);
  router.post('/', authMiddleware, taskController.create);
  router.put('/:id', authMiddleware, taskController.update);
  router.delete('/:id', authMiddleware, taskController.delete);

  export default router;