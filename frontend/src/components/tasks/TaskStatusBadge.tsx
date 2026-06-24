import React from 'react';
import { StatusBadge } from '../ui/Badge';
import type { TaskStatus } from '../../types';
import { getStatusLabel } from '../../utils/helpers';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

const dotColors: Record<TaskStatus, string> = {
  TODO: 'bg-slate-400',
  IN_PROGRESS: 'bg-indigo-400',
  REVIEW: 'bg-amber-400',
  COMPLETED: 'bg-emerald-400',
};

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  size = 'sm',
  showDot = false,
}) => {
  if (showDot) {
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
        <span className="text-xs text-slate-400">{getStatusLabel(status)}</span>
      </div>
    );
  }

  return <StatusBadge status={status} size={size} />;
};

export default TaskStatusBadge;
