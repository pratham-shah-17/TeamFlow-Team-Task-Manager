import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { errorResponse } from '../utils/response.utils';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'Authentication required. Please provide a valid token.', 401);
      return;
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    if (!token) {
      errorResponse(res, 'Authentication token is missing.', 401);
      return;
    }

    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    errorResponse(res, 'Invalid or expired token. Please log in again.', 401);
  }
}
