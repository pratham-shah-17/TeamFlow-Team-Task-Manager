import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getMembers,
  addMember,
  removeMember,
} from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireProjectAdmin, requireProjectMembership } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from '../validators/project.validator';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// GET /api/projects
router.get('/', getProjects);

// POST /api/projects
router.post('/', validate(createProjectSchema), createProject);

// GET /api/projects/:id
router.get('/:id', requireProjectMembership, getProjectById);

// PUT /api/projects/:id
router.put('/:id', requireProjectAdmin, validate(updateProjectSchema), updateProject);

// DELETE /api/projects/:id
router.delete('/:id', requireProjectAdmin, deleteProject);

// GET /api/projects/:id/members
router.get('/:id/members', requireProjectMembership, getMembers);

// POST /api/projects/:id/members
router.post('/:id/members', requireProjectAdmin, validate(addMemberSchema), addMember);

// DELETE /api/projects/:id/members/:userId
router.delete('/:id/members/:userId', requireProjectAdmin, removeMember);

export default router;
