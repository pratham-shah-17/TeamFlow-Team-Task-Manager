import { Request, Response, NextFunction } from 'express';
import * as tasksService from '../services/tasks.service';
import { successResponse, errorResponse } from '../utils/response.utils';

export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }

    const filters = {
      projectId: req.query.projectId as string | undefined,
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      assignedToId: req.query.assignedToId as string | undefined,
    };

    const tasks = await tasksService.getTasks(filters, req.user.userId, req.user.role);
    successResponse(res, tasks);
  } catch (error) {
    next(error);
  }
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    const task = await tasksService.createTask(req.body, req.user.userId);
    successResponse(res, task, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 400);
      return;
    }
    next(error);
  }
}

export async function getTaskById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const task = await tasksService.getTaskById(req.params.id);
    successResponse(res, task);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 404);
      return;
    }
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    const task = await tasksService.updateTask(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.role
    );
    successResponse(res, task);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      const statusCode = error.message.includes('not found') ? 404 : 403;
      errorResponse(res, error.message, statusCode);
      return;
    }
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await tasksService.deleteTask(req.params.id);
    successResponse(res, result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 404);
      return;
    }
    next(error);
  }
}
