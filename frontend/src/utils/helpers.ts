import { format, isBefore, parseISO } from 'date-fns';
import type { TaskStatus, Priority } from '../types';

export const formatDate = (date: string): string => {
  try {
    return format(parseISO(date), 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string): string => {
  try {
    return format(parseISO(date), 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
};

export const isOverdue = (dueDate: string): boolean => {
  try {
    return isBefore(parseISO(dueDate), new Date());
  } catch {
    return false;
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'TODO':
      return 'bg-slate-700 text-slate-300';
    case 'IN_PROGRESS':
      return 'bg-indigo-900/60 text-indigo-300';
    case 'REVIEW':
      return 'bg-amber-900/60 text-amber-300';
    case 'COMPLETED':
      return 'bg-emerald-900/60 text-emerald-300';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};

export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'TODO':
      return 'To Do';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'REVIEW':
      return 'Review';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status;
  }
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'LOW':
      return 'bg-slate-700 text-slate-300';
    case 'MEDIUM':
      return 'bg-amber-900/60 text-amber-300';
    case 'HIGH':
      return 'bg-rose-900/60 text-rose-300';
    default:
      return 'bg-slate-700 text-slate-300';
  }
};

export const getPriorityDot = (priority: Priority): string => {
  switch (priority) {
    case 'LOW':
      return 'bg-slate-400';
    case 'MEDIUM':
      return 'bg-amber-400';
    case 'HIGH':
      return 'bg-rose-400';
    default:
      return 'bg-slate-400';
  }
};

export const getStatusDotColor = (status: TaskStatus): string => {
  switch (status) {
    case 'TODO':
      return 'bg-slate-400';
    case 'IN_PROGRESS':
      return 'bg-indigo-400';
    case 'REVIEW':
      return 'bg-amber-400';
    case 'COMPLETED':
      return 'bg-emerald-400';
    default:
      return 'bg-slate-400';
  }
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).slice(2, 11);
};
