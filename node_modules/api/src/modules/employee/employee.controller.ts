import { Response } from 'express';                                                                
  import { AuthRequest } from '../../middleware/auth.middleware';
  import { employeeService } from './employee.service';

  export const employeeController = {
    async getAll(req: AuthRequest, res: Response) {
      try {
        const employees = await employeeService.getAll(req.user!.orgId);
        res.json(employees);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },

    async getById(req: AuthRequest, res: Response) {
      try {
        const id = req.params.id as string;
        const employee = await employeeService.getById(id, req.user!.orgId);
        res.json(employee);
      } catch (error: any) {
        res.status(404).json({ error: error.message });
      }
    },

    async create(req: AuthRequest, res: Response) {
      try {
        const employee = await employeeService.create(req.user!.orgId, req.body);
        res.status(201).json(employee);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async update(req: AuthRequest, res: Response) {
      try {
        const id = req.params.id as string;
        const employee = await employeeService.update(
          id,
          req.user!.orgId,
          req.body
        );
        res.json(employee);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },

    async delete(req: AuthRequest, res: Response) {
      try {
        const id = req.params.id as string;
        const result = await employeeService.delete(id, req.user!.orgId);
        res.json(result);
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    },
  };