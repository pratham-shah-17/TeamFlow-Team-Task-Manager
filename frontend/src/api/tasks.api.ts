import api from './axios';
import type { Task, CreateTaskData, UpdateTaskData, TaskFilters } from '../types';

export const getTasks = async (params?: TaskFilters): Promise<Task[]> => {
  const response = await api.get('/tasks', { params });
  return response.data.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data;
};

export const updateTask = async (id: string, data: UpdateTaskData): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
