import { Router } from 'express';
import { employeeController } from './employee.controller';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.post('/', requireRole('ADMIN', 'HR_MANAGER'), employeeController.create);
router.put('/:id', requireRole('ADMIN', 'HR_MANAGER'), employeeController.update);
router.delete('/:id', requireRole('ADMIN'), employeeController.delete);

export default router;
