import { Response } from 'express';
  import { AuthRequest } from '../../middleware/auth.middleware';
  import { organizationService } from './organization.service';

  export const organizationController = {
    async getMyOrganization(req: AuthRequest, res: Response) {
      try {
        const organization = await organizationService.getById(req.user!.orgId);
        res.json(organization);
      } catch (error: any) {
        res.status(404).json({ error: error.message });
      }
    },

    async update(req: AuthRequest, res: Response) {
      try {
        const organization = await organizationService.update(req.user!.orgId, req.body);
        res.json(organization);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async getDashboardStats(req: AuthRequest, res: Response) {
      try {
        const stats = await organizationService.getDashboardStats(req.user!.orgId);
        res.json(stats);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },
  };