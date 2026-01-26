 import { Request, Response, NextFunction } from 'express';
  import { AIService } from './ai.service';

  interface AuthRequest extends Request {
      user?: {
          id: string;
          organizationId: string;
          email: string;
          role: string;
      };
  }

  export class AIController {
      private aiService = new AIService();

      chat = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const { message } = req.body;
              const userId = req.user!.id;
              const orgId = req.user!.organizationId;

              const response = await this.aiService.processChat(message, userId, orgId);
              res.json({ response });
          } catch (error) {
              next(error);
          }
      };

      parseResume = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const { resumeText } = req.body;
              const result = await this.aiService.parseResume(resumeText);
              res.json(result);
          } catch (error) {
              next(error);
          }
      };

      getInsights = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const orgId = req.user!.organizationId;
              const insights = await this.aiService.generateInsights(orgId);
              res.json(insights);
          } catch (error) {
              next(error);
          }
      };

      intelligentSearch = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const { query } = req.body;
              const orgId = req.user!.organizationId;
              const results = await this.aiService.intelligentSearch(query, orgId);
              res.json(results);
          } catch (error) {
              next(error);
          }
      };

      suggestAssignee = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const { taskTitle, taskDescription, projectId } = req.body;
              const orgId = req.user!.organizationId;
              const suggestion = await this.aiService.suggestAssignee(taskTitle, taskDescription,       
  projectId, orgId);
              res.json(suggestion);
          } catch (error) {
              next(error);
          }
      };

      generateReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
          try {
              const { reportType, dateRange } = req.body;
              const orgId = req.user!.organizationId;
              const report = await this.aiService.generateReport(reportType, dateRange, orgId);
              res.json(report);
          } catch (error) {
              next(error);
          }
      };
  }