import prisma from '../config/db';
import { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';

const PROJECT_MEMBER_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
};

export async function getProjects(userId: string, role: string) {
  // Global ADMIN sees all projects; MEMBER sees only their projects
  if (role === 'ADMIN') {
    return prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { members: true, tasks: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  return prisma.project.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { members: true, tasks: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function createProject(data: CreateProjectInput, userId: string) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        title: data.title,
        description: data.description,
        createdById: userId,
      },
    });

    // Creator automatically becomes project ADMIN
    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId,
        roleInProject: 'ADMIN',
      },
    });

    return tx.project.findUnique({
      where: { id: project.id },
      include: {
        _count: {
          select: { members: true, tasks: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  });
}

export async function getProjectById(id: string, userId: string, role: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      members: {
        include: {
          user: {
            select: PROJECT_MEMBER_USER_SELECT,
          },
        },
      },
      _count: {
        select: { members: true, tasks: true },
      },
    },
  });

  if (!project) {
    const error = new Error('Project not found.');
    error.name = 'ValidationError';
    throw error;
  }

  // Non-admin: verify membership
  if (role !== 'ADMIN') {
    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      const error = new Error('You are not a member of this project.');
      error.name = 'ValidationError';
      throw error;
    }
  }

  return project;
}

export async function updateProject(id: string, data: UpdateProjectInput) {
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    const error = new Error('Project not found.');
    error.name = 'ValidationError';
    throw error;
  }

  return prisma.project.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
    },
    include: {
      _count: {
        select: { members: true, tasks: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    const error = new Error('Project not found.');
    error.name = 'ValidationError';
    throw error;
  }

  // Tasks and members cascade due to Prisma schema onDelete: Cascade
  await prisma.project.delete({ where: { id } });

  return { message: 'Project deleted successfully.' };
}
