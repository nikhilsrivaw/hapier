  import { Response } from 'express';
  import { AuthRequest } from '../../middleware/auth.middleware';
  import { departmentService } from './department.service';

  export const departmentController = {
    async getAll(req: AuthRequest, res: Response) {
      try {
        const departments = await departmentService.getAll(req.user!.orgId);
        res.json(departments);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },

    async getById(req: AuthRequest, res: Response) {
      try {
        const id = req.params.id as string;
        const department = await departmentService.getById(id, req.user!.orgId);
        res.json(department);
      } catch (error: any) {
        res.status(404).json({ error: error.message });
      }
    },

    async create(req: AuthRequest, res: Response) {
      try {
        const department = await departmentService.create(req.user!.orgId, req.body);
        res.status(201).json(department);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async update(req: AuthRequest, res: Response) {
      try {
        const id = req.params.id as string;
        const department = await departmentService.update(id, req.user!.orgId, req.body);
        res.json(department);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async delete(req: AuthRequest, res: Response) {
      try {
        const id = req.params.id as string;
        const result = await departmentService.delete(id, req.user!.orgId);
        res.json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },
  };
