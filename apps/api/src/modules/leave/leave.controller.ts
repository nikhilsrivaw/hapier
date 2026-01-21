import { Response } from 'express';
  import { AuthRequest } from '../../middleware/auth.middleware';
  import { leaveService } from './leave.service';

  export const leaveController = {
    // Employee creates leave request
    async createRequest(req: AuthRequest, res: Response) {
      try {
        const employeeId = req.body.employeeId;
        const request = await leaveService.createRequest(employeeId, req.user!.orgId, req.body);     
        res.status(201).json(request);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    // Employee views their requests
    async getMyRequests(req: AuthRequest, res: Response) {
      try {
        const employeeId = req.params.employeeId as string;
        const requests = await leaveService.getByEmployee(employeeId, req.user!.orgId);
        res.json(requests);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    // HR views pending requests
    async getPendingRequests(req: AuthRequest, res: Response) {
      try {
        const requests = await leaveService.getPendingRequests(req.user!.orgId);
        res.json(requests);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },

    // HR views all requests
    async getAllRequests(req: AuthRequest, res: Response) {
      try {
        const status = req.query.status as string | undefined;
        const requests = await leaveService.getAll(req.user!.orgId, status);
        res.json(requests);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },

    // HR approves/rejects request
    async updateStatus(req: AuthRequest, res: Response) {
      try {
        const requestId = req.params.id as string;
        const request = await leaveService.updateStatus(
          requestId,
          req.user!.orgId,
          req.user!.userId,
          req.body
        );
        res.json(request);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    // Employee cancels request
    async cancelRequest(req: AuthRequest, res: Response) {
      try {
        const requestId = req.params.id as string;
        const employeeId = req.body.employeeId;
        const request = await leaveService.cancelRequest(requestId, employeeId);
        res.json(request);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    // Leave types
    async createLeaveType(req: AuthRequest, res: Response) {
      try {
        const leaveType = await leaveService.createLeaveType(req.user!.orgId, req.body);
        res.status(201).json(leaveType);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async getLeaveTypes(req: AuthRequest, res: Response) {
      try {
        const leaveTypes = await leaveService.getLeaveTypes(req.user!.orgId);
        res.json(leaveTypes);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },
  };