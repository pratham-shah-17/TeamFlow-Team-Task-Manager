export type UserRole = 'ADMIN' | 'MEMBER';
export type ProjectRole = 'ADMIN' | 'MEMBER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdById: string;
  createdAt: string;
  _count?: {
    members: number;
    tasks: number;
  };
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  roleInProject: ProjectRole;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  assignedTo?: User;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
  };
}

export interface DashboardData {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  assignedToMe: number;
  completionPercentage: number;
  recentTasks: Task[];
  upcomingDeadlines: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  assignedToId?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: Priority;
  assignedToId?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
