import prisma from '../config/db';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';

const TASK_INCLUDE = {
  assignedTo: {
    select: { id: true, name: true, email: true },
  },
  project: {
    select: { id: true, title: true },
  },
  createdBy: {
    select: { id: true, name: true, email: true },
  },
};

interface TaskFilters {
  projectId?: string;
  status?: string;
  priority?: string;
  assignedToId?: string;
}

export async function getTasks(filters: TaskFilters, userId: string, role: string) {
  // Build where clause
  const where: Record<string, unknown> = {};

  if (filters.projectId) {
    where.projectId = filters.projectId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.assignedToId) {
    where.assignedToId = filters.assignedToId;
  }

  // Non-admins can only see tasks in projects they are members of
  if (role !== 'ADMIN') {
    where.project = {
      members: {
        some: { userId },
      },
    };
  }

  return prisma.task.findMany({
    where,
    include: TASK_INCLUDE,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTask(data: CreateTaskInput, createdById: string) {
  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.name = 'ValidationError';
    throw error;
  }

  // Verify assignee exists and is a project member (if provided)
  if (data.assignedToId) {
    const assigneeMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: data.assignedToId,
        },
      },
    });

    if (!assigneeMembership) {
      const error = new Error('Assignee must be a member of the project.');
      error.name = 'ValidationError';
      throw error;
    }
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      assignedToId: data.assignedToId || null,
      status: data.status || 'TODO',
      priority: data.priority || 'MEDIUM',
      dueDate: data.dueDate || null,
      createdById,
    },
    include: TASK_INCLUDE,
  });
}

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: TASK_INCLUDE,
  });

  if (!task) {
    const error = new Error('Task not found.');
    error.name = 'ValidationError';
    throw error;
  }

  return task;
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput,
  userId: string,
  userRole: string
) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });

  if (!task) {
    const error = new Error('Task not found.');
    error.name = 'ValidationError';
    throw error;
  }

  const isGlobalAdmin = userRole === 'ADMIN';

  if (!isGlobalAdmin) {
    // Check if user is a project member
    const membership = task.project.members.find((m) => m.userId === userId);

    if (!membership) {
      const error = new Error('You are not a member of this project.');
      error.name = 'ValidationError';
      throw error;
    }

    const isProjectAdmin = membership.roleInProject === 'ADMIN';
    const isTaskCreator = task.createdById === userId;
    const isAssignee = task.assignedToId === userId;

    if (!isProjectAdmin && !isTaskCreator) {
      // Regular members can only update status of tasks assigned to them
      if (!isAssignee) {
        const error = new Error('You can only update tasks assigned to you.');
        error.name = 'ValidationError';
        throw error;
      }

      // Limit what they can update
      const allowedKeys = ['status'];
      const requestedKeys = Object.keys(data).filter(
        (k) => data[k as keyof UpdateTaskInput] !== undefined
      );
      const forbiddenKeys = requestedKeys.filter((k) => !allowedKeys.includes(k));

      if (forbiddenKeys.length > 0) {
        const error = new Error(
          'You can only update the status of tasks assigned to you.'
        );
        error.name = 'ValidationError';
        throw error;
      }
    }
  }

  // Verify new assignee is a project member (if changed)
  if (data.assignedToId !== undefined && data.assignedToId !== null) {
    const assigneeMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: task.projectId,
          userId: data.assignedToId,
        },
      },
    });

    if (!assigneeMembership) {
      const error = new Error('Assignee must be a member of the project.');
      error.name = 'ValidationError';
      throw error;
    }
  }

  return prisma.task.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
    },
    include: TASK_INCLUDE,
  });
}

export async function deleteTask(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    const error = new Error('Task not found.');
    error.name = 'ValidationError';
    throw error;
  }

  await prisma.task.delete({ where: { id } });

  return { message: 'Task deleted successfully.' };
}
