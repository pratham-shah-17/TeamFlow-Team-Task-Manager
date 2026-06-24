import prisma from '../config/db';
import { AddMemberInput } from '../validators/project.validator';

const MEMBER_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
};

export async function getMembers(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    const error = new Error('Project not found.');
    error.name = 'ValidationError';
    throw error;
  }

  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: MEMBER_USER_SELECT,
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function addMember(projectId: string, data: AddMemberInput) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    const error = new Error('Project not found.');
    error.name = 'ValidationError';
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { id: data.userId } });

  if (!user) {
    const error = new Error('User not found.');
    error.name = 'ValidationError';
    throw error;
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: data.userId,
      },
    },
  });

  if (existingMember) {
    const error = new Error('This user is already a member of the project.');
    error.name = 'ValidationError';
    throw error;
  }

  return prisma.projectMember.create({
    data: {
      projectId,
      userId: data.userId,
      roleInProject: data.roleInProject,
    },
    include: {
      user: {
        select: MEMBER_USER_SELECT,
      },
    },
  });
}

export async function removeMember(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    const error = new Error('Project not found.');
    error.name = 'ValidationError';
    throw error;
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!membership) {
    const error = new Error('This user is not a member of the project.');
    error.name = 'ValidationError';
    throw error;
  }

  // Prevent removing the last admin
  if (membership.roleInProject === 'ADMIN') {
    const adminCount = await prisma.projectMember.count({
      where: { projectId, roleInProject: 'ADMIN' },
    });

    if (adminCount <= 1) {
      const error = new Error(
        'Cannot remove the last admin from the project. Assign another admin first.'
      );
      error.name = 'ValidationError';
      throw error;
    }
  }

  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  return { message: 'Member removed successfully.' };
}
