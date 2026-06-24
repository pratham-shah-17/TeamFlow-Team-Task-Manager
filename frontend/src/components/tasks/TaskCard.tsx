import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, FolderKanban } from 'lucide-react';
import type { Task } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { formatDate, isOverdue, getInitials } from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  showProject?: boolean;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, showProject = true, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/tasks/${task.id}`);
    }
  };

  const overdueTask = task.dueDate && isOverdue(task.dueDate) && task.status !== 'COMPLETED';

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-lg group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium text-white leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2 flex-1">
          {task.title}
        </h4>
        <PriorityBadge priority={task.priority} size="sm" />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Project */}
      {showProject && task.project && (
        <div className="flex items-center gap-1.5 mb-3">
          <FolderKanban size={12} className="text-slate-600" />
          <span className="text-xs text-slate-500 truncate">{task.project.title}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={task.status} size="sm" />

        <div className="flex items-center gap-2 ml-auto">
          {/* Due date */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 ${
                overdueTask ? 'text-rose-400' : 'text-slate-500'
              }`}
            >
              {overdueTask ? (
                <AlertCircle size={12} />
              ) : (
                <Calendar size={12} />
              )}
              <span className="text-xs">{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Assignee avatar */}
          {task.assignedTo && (
            <div
              className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white"
              title={task.assignedTo.name}
            >
              {getInitials(task.assignedTo.name)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
