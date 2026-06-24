import { PrismaClient, Role, ProjectRole, TaskStatus, Priority } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash('password123', 12);
  const memberPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const member = await prisma.user.create({
    data: {
      name: 'Jane Member',
      email: 'member@demo.com',
      passwordHash: memberPassword,
      role: Role.MEMBER,
    },
  });

  console.log('✅ Users created:', admin.email, member.email);

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved UX.',
      createdById: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Development',
      description: 'Build a cross-platform mobile application for iOS and Android.',
      createdById: admin.id,
    },
  });

  console.log('✅ Projects created:', project1.title, project2.title);

  // Add members to projects
  await prisma.projectMember.createMany({
    data: [
      { projectId: project1.id, userId: admin.id, roleInProject: ProjectRole.ADMIN },
      { projectId: project1.id, userId: member.id, roleInProject: ProjectRole.MEMBER },
      { projectId: project2.id, userId: admin.id, roleInProject: ProjectRole.ADMIN },
      { projectId: project2.id, userId: member.id, roleInProject: ProjectRole.MEMBER },
    ],
  });

  console.log('✅ Project members added');

  const now = new Date();
  const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const subDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Create tasks across both projects
  await prisma.task.createMany({
    data: [
      // Website Redesign tasks
      {
        title: 'Design new homepage layout',
        description: 'Create wireframes and high-fidelity mockups for the new homepage.',
        projectId: project1.id,
        assignedToId: member.id,
        status: TaskStatus.COMPLETED,
        priority: Priority.HIGH,
        dueDate: subDays(5),
        createdById: admin.id,
      },
      {
        title: 'Implement responsive navigation',
        description: 'Build the navigation component to work seamlessly on mobile and desktop.',
        projectId: project1.id,
        assignedToId: member.id,
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: addDays(3),
        createdById: admin.id,
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        projectId: project1.id,
        assignedToId: admin.id,
        status: TaskStatus.REVIEW,
        priority: Priority.MEDIUM,
        dueDate: addDays(7),
        createdById: admin.id,
      },
      {
        title: 'Write SEO meta tags',
        description: 'Add proper meta tags, Open Graph data, and structured data to all pages.',
        projectId: project1.id,
        assignedToId: member.id,
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        dueDate: addDays(14),
        createdById: admin.id,
      },
      // Mobile App Development tasks
      {
        title: 'Set up React Native project',
        description: 'Initialize the project with Expo, configure navigation and state management.',
        projectId: project2.id,
        assignedToId: admin.id,
        status: TaskStatus.COMPLETED,
        priority: Priority.HIGH,
        dueDate: subDays(10),
        createdById: admin.id,
      },
      {
        title: 'Build authentication screens',
        description: 'Create login, signup, and forgot-password screens with form validation.',
        projectId: project2.id,
        assignedToId: member.id,
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        dueDate: addDays(5),
        createdById: admin.id,
      },
      {
        title: 'Integrate push notifications',
        description: 'Set up Firebase Cloud Messaging for Android and APNs for iOS push notifications.',
        projectId: project2.id,
        assignedToId: admin.id,
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: addDays(20),
        createdById: admin.id,
      },
      {
        title: 'Performance audit and optimization',
        description: 'Profile app performance, reduce bundle size, and optimize rendering.',
        projectId: project2.id,
        assignedToId: member.id,
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        dueDate: addDays(30),
        createdById: admin.id,
      },
    ],
  });

  console.log('✅ Tasks created');
  console.log('🎉 Seed completed successfully!');
  console.log('\nDemo credentials:');
  console.log('  Admin  → admin@demo.com  / password123');
  console.log('  Member → member@demo.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
