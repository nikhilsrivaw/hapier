  import { Response, NextFunction } from 'express';
  import { taskService } from './task.service';
  import { AuthRequest } from '../../middleware/auth.middleware';

  export const taskController = {
      async getAll(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const { status, assigneeId, priority } = req.query;
              const tasks = await taskService.getAll(req.user!.orgId, {
                  status: status as string,
                  assigneeId: assigneeId as string,
                  priority: priority as string,
              });
              res.json(tasks);
          } catch (error) {
              next(error);
          }
      },

      async getById(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const task = await taskService.getById(req.params.id as string, req.user!.orgId);
              res.json(task);
          } catch (error) {
              next(error);
          }
      },

      async create(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const { title, description, status, priority, dueDate, assigneeId } = req.body;        

              if (!title) {
                  return res.status(400).json({ error: 'Title is required' });
              }

              const task = await taskService.create(req.user!.orgId, req.user!.employeeId as string , {
                  title,
                  description,
                  status,
                  priority,
                  dueDate,
                  assigneeId,
              });
              res.status(201).json(task);
          } catch (error) {
              next(error);
          }
      },

      async update(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const task = await taskService.update(req.params.id as string , req.user!.orgId, req.body);       
              res.json(task);
          } catch (error) {
              next(error);
          }
      },

      async delete(req: AuthRequest, res: Response, next: NextFunction) {
          try {
              const result = await taskService.delete(req.params.id as string, req.user!.orgId);
              res.json(result);
          } catch (error) {
              next(error);
          }
      },
  };