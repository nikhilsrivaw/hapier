
  import { Router } from 'express';
  import { departmentController } from './department.controller';
  import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

  const router = Router();

  router.use(authMiddleware);

  router.get('/', departmentController.getAll);
  router.get('/:id', departmentController.getById);
  router.post('/', requireRole('ADMIN', 'HR_MANAGER'), departmentController.create);
  router.put('/:id', requireRole('ADMIN', 'HR_MANAGER'), departmentController.update);
  router.delete('/:id', requireRole('ADMIN'), departmentController.delete);

  export default router;