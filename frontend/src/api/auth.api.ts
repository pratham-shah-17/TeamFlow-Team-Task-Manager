import api from './axios';
import type { User, LoginCredentials, SignupCredentials } from '../types';

export const login = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
  const response = await api.post('/auth/login', credentials);
  return response.data.data;
};

export const signup = async (credentials: SignupCredentials): Promise<{ token: string; user: User }> => {
  const response = await api.post('/auth/signup', credentials);
  return response.data.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data.data;
};
