import { Request, Response, NextFunction } from 'express';
import * as projectsService from '../services/projects.service';
import * as membersService from '../services/members.service';
import { successResponse, errorResponse } from '../utils/response.utils';

export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    const projects = await projectsService.getProjects(req.user.userId, req.user.role);
    successResponse(res, projects);
  } catch (error) {
    next(error);
  }
}

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    const project = await projectsService.createProject(req.body, req.user.userId);
    successResponse(res, project, 201);
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    const project = await projectsService.getProjectById(
      req.params.id,
      req.user.userId,
      req.user.role
    );
    successResponse(res, project);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 404);
      return;
    }
    next(error);
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const project = await projectsService.updateProject(req.params.id, req.body);
    successResponse(res, project);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 404);
      return;
    }
    next(error);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await projectsService.deleteProject(req.params.id);
    successResponse(res, result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 404);
      return;
    }
    next(error);
  }
}

export async function getMembers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const members = await membersService.getMembers(req.params.id);
    successResponse(res, members);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 404);
      return;
    }
    next(error);
  }
}

export async function addMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const member = await membersService.addMember(req.params.id, req.body);
    successResponse(res, member, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 400);
      return;
    }
    next(error);
  }
}

export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await membersService.removeMember(req.params.id, req.params.userId);
    successResponse(res, result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      errorResponse(res, error.message, 400);
      return;
    }
    next(error);
  }
}
