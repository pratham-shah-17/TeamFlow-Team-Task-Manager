import prisma from '../config/db';

export async function getDashboard(userId: string, role: string) {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Build base project filter based on role
  const projectFilter =
    role === 'ADMIN'
      ? {}
      : {
          members: {
            some: { userId },
          },
        };

  // Build base task filter based on role
  const taskFilter =
    role === 'ADMIN'
      ? {}
      : {
          project: {
            members: {
              some: { userId },
            },
          },
        };

  // Run all queries in parallel
  const [
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    assignedToMe,
    recentTasks,
    upcomingDeadlines,
  ] = await Promise.all([
    // Total projects
    prisma.project.count({ where: projectFilter }),

    // Total tasks in accessible projects
    prisma.task.count({ where: taskFilter }),

    // Completed tasks
    prisma.task.count({
      where: { ...taskFilter, status: 'COMPLETED' },
    }),

    // Overdue tasks (not completed, past due date)
    prisma.task.count({
      where: {
        ...taskFilter,
        dueDate: { lt: now },
        status: { not: 'COMPLETED' },
      },
    }),

    // Tasks assigned to the current user
    prisma.task.count({
      where: {
        assignedToId: userId,
      },
    }),

    // Recent tasks (last 5)
    prisma.task.findMany({
      where: taskFilter,
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    }),

    // Upcoming deadlines (next 7 days, not completed)
    prisma.task.findMany({
      where: {
        ...taskFilter,
        dueDate: {
          gte: now,
          lte: sevenDaysFromNow,
        },
        status: { not: 'COMPLETED' },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    }),
  ]);

  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    assignedToMe,
    completionPercentage,
    recentTasks,
    upcomingDeadlines,
  };
}
