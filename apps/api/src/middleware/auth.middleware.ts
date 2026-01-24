import { Request, Response, NextFunction } from 'express';
  import jwt from 'jsonwebtoken';

  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  export interface AuthRequest extends Request {
    user?: {
      userId: string;
      role: string;
      orgId: string;
      employeeId: string | null;
    };
  }

  export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        role: string;
        orgId: string;
         employeeId: string | null;
      };

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Role-based access control middleware
  export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  };
