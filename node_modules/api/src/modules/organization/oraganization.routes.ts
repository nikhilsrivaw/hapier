import { Router } from 'express';
  import { organizationController } from './organization.controller';
  import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

  const router = Router();

  router.use(authMiddleware);

  router.get('/', organizationController.getMyOrganization);
  router.put('/', requireRole('ADMIN'), organizationController.update);
  router.get('/dashboard', organizationController.getDashboardStats);

  export default router;