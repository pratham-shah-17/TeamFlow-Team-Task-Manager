import api from './axios';
import type { User } from '../types';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

export const updateProfile = async (data: { name?: string }): Promise<User> => {
  const response = await api.put('/users/me', data);
  return response.data.data;
};
