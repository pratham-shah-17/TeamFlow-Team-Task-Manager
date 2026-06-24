import React from 'react';
import type { TaskStatus, Priority } from '../../types';
import { getStatusColor, getStatusLabel, getPriorityColor } from '../../utils/helpers';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

interface GenericBadgeProps {
  label: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {label}
    </span>
  );
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const colorClass = getPriorityColor(priority);
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${colorClass} ${sizeClass}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          priority === 'HIGH'
            ? 'bg-rose-400'
            : priority === 'MEDIUM'
            ? 'bg-amber-400'
            : 'bg-slate-400'
        }`}
      />
      {priority}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: string; size?: 'sm' | 'md' }> = ({
  role,
  size = 'sm',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const colorClass =
    role === 'ADMIN'
      ? 'bg-indigo-900/60 text-indigo-300'
      : 'bg-slate-700 text-slate-300';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {role}
    </span>
  );
};

export const GenericBadge: React.FC<GenericBadgeProps> = ({
  label,
  className = '',
  size = 'sm',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${className}`}
    >
      {label}
    </span>
  );
};
