import api from './axios';
import type { Project, ProjectMember, CreateProjectData } from '../types';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data.data;
};

export const createProject = async (data: CreateProjectData): Promise<Project> => {
  const response = await api.post('/projects', data);
  return response.data.data;
};

export const getProject = async (id: string): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data.data;
};

export const updateProject = async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const getMembers = async (projectId: string): Promise<ProjectMember[]> => {
  const response = await api.get(`/projects/${projectId}/members`);
  return response.data.data;
};

export const addMember = async (projectId: string, data: { email: string; roleInProject?: string }): Promise<ProjectMember> => {
  const response = await api.post(`/projects/${projectId}/members`, data);
  return response.data.data;
};

export const removeMember = async (projectId: string, userId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}/members/${userId}`);
};
