import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { errorResponse } from '../utils/response.utils';

/**
 * Requires the authenticated user to have one of the specified global roles.
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      errorResponse(res, 'You do not have permission to perform this action.', 403);
      return;
    }
    next();
  };
}

/**
 * Requires the authenticated user to be a member of the project (via req.params.id).
 * Attaches projectMember to req for downstream use.
 */
export function requireProjectMembership(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  (async () => {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }

    const projectId = req.params.id || req.params.projectId;

    if (!projectId) {
      errorResponse(res, 'Project ID is required.', 400);
      return;
    }

    // Global admins bypass membership check
    if (req.user.role === 'ADMIN') {
      next();
      return;
    }

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!membership) {
      errorResponse(res, 'You are not a member of this project.', 403);
      return;
    }

    next();
  })().catch(next);
}

/**
 * Requires the authenticated user to have ADMIN role in the project OR be a global ADMIN.
 */
export function requireProjectAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  (async () => {
    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }

    // Global ADMIN can do anything
    if (req.user.role === 'ADMIN') {
      next();
      return;
    }

    const projectId = req.params.id || req.params.projectId;

    if (!projectId) {
      errorResponse(res, 'Project ID is required.', 400);
      return;
    }

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.userId,
        },
      },
    });

    if (!membership || membership.roleInProject !== 'ADMIN') {
      errorResponse(
        res,
        'You must be a project admin to perform this action.',
        403
      );
      return;
    }

    next();
  })().catch(next);
}
