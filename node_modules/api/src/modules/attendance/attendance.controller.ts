 import { Response } from 'express';
  import { AuthRequest } from '../../middleware/auth.middleware';
  import { attendanceService } from './attendance.service';

  export const attendanceController = {
    async checkIn(req: AuthRequest, res: Response) {
      try {
        const employeeId = req.body.employeeId || req.user!.userId;
        const attendance = await attendanceService.checkIn(employeeId, req.user!.orgId);
        res.status(201).json(attendance);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async checkOut(req: AuthRequest, res: Response) {
      try {
        const employeeId = req.body.employeeId || req.user!.userId;
        const attendance = await attendanceService.checkOut(employeeId, req.user!.orgId);
        res.json(attendance);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async getMyAttendance(req: AuthRequest, res: Response) {
      try {
        const month = req.query.month ? parseInt(req.query.month as string) : undefined;
        const year = req.query.year ? parseInt(req.query.year as string) : undefined;

        // Need to get employee ID from user ID
        const attendance = await attendanceService.getByEmployee(
          req.body.employeeId,
          req.user!.orgId,
          month,
          year
        );
        res.json(attendance);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async getEmployeeAttendance(req: AuthRequest, res: Response) {
      try {
        const employeeId = req.params.employeeId as string;
        const month = req.query.month ? parseInt(req.query.month as string) : undefined;
        const year = req.query.year ? parseInt(req.query.year as string) : undefined;

        const attendance = await attendanceService.getByEmployee(
          employeeId,
          req.user!.orgId,
          month,
          year
        );
        res.json(attendance);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async getTodayAll(req: AuthRequest, res: Response) {
      try {
        const attendance = await attendanceService.getTodayAll(req.user!.orgId);
        res.json(attendance);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },

    async markAttendance(req: AuthRequest, res: Response) {
      try {
        const attendance = await attendanceService.markAttendance(req.user!.orgId, req.body);        
        res.json(attendance);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },
  };