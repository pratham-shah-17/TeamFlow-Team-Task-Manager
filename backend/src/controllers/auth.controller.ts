import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.utils';

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.signup(req.body);
    successResponse(res, result, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 400);
      return;
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body);
    successResponse(res, result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 401);
      return;
    }
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    const user = await authService.getMe(req.user.userId);
    successResponse(res, user);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 404);
      return;
    }
    next(error);
  }
}
