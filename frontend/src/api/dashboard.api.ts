import api from './axios';
import type { DashboardData } from '../types';

export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get('/dashboard');
  return response.data.data;
};
