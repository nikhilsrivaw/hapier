import { Router } from 'express';
  import { attendanceController } from './attendance.controller';
  import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

  const router = Router();

  router.use(authMiddleware);

  // Employee actions
  router.post('/check-in', attendanceController.checkIn);
  router.post('/check-out', attendanceController.checkOut);

  // View attendance
  router.get('/today', requireRole('ADMIN', 'HR_MANAGER'), attendanceController.getTodayAll);        
  router.get('/employee/:employeeId', attendanceController.getEmployeeAttendance);

  // HR/Admin manual marking
  router.post('/mark', requireRole('ADMIN', 'HR_MANAGER'), attendanceController.markAttendance);     

  export default router;