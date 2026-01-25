  import { Response, NextFunction } from 'express';
  import { projectService } from './project.service';
  import { AuthRequest } from '../../middleware/auth.middleware';

  export const projectController = {
      async getAll(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const projects = await projectService.getAll(req.user!.orgId);
              res.json(projects);
          } catch (error) {
              next(error);
          }
      },

      async getById(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const project = await projectService.getById(
                  req.params.id as string,
                  req.user!.orgId
              );
              res.json(project);
          } catch (error) {
              next(error);
          }
      },

      async create(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const { name, description, status, startDate, endDate } = req.body;

              if (!name) {
                  return res.status(400).json({ error: 'Project name is required' });
              }

              if (!req.user!.employeeId) {
                  return res.status(400).json({ error: 'Employee profile not found' });
              }

              const project = await projectService.create(
                  req.user!.orgId,
                  req.user!.employeeId,
                  { name, description, status, startDate, endDate }
              );
              res.status(201).json(project);
          } catch (error) {
              next(error);
          }
      },

      async update(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const project = await projectService.update(
                  req.params.id as string,
                  req.user!.orgId,
                  req.body
              );
              res.json(project);
          } catch (error) {
              next(error);
          }
      },

      async delete(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const result = await projectService.delete(
                  req.params.id as string,
                  req.user!.orgId
              );
              res.json(result);
          } catch (error) {
              next(error);
          }
      },
  };
