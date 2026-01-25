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
  }