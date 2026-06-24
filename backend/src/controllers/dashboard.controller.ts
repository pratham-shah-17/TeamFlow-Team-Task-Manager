import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { successResponse, errorResponse } from '../utils/response.utils';

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    const data = await dashboardService.getDashboard(req.user.userId, req.user.role);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
}
