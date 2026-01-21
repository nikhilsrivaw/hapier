import { Router } from 'express';
  import { leaveController } from './leave.controller';
  import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

  const router = Router();

  router.use(authMiddleware);

  // Leave types (must be created first)
  router.get('/types', leaveController.getLeaveTypes);
  router.post('/types', requireRole('ADMIN', 'HR_MANAGER'), leaveController.createLeaveType);        

  // Employee actions
  router.post('/request', leaveController.createRequest);
  router.get('/my-requests/:employeeId', leaveController.getMyRequests);
  router.post('/:id/cancel', leaveController.cancelRequest);

  // HR/Admin actions
  router.get('/pending', requireRole('ADMIN', 'HR_MANAGER'), leaveController.getPendingRequests);    
  router.get('/all', requireRole('ADMIN', 'HR_MANAGER'), leaveController.getAllRequests);
  router.patch('/:id/status', requireRole('ADMIN', 'HR_MANAGER'), leaveController.updateStatus);     

  export default router;