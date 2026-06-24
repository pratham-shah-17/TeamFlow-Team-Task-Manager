import React from 'react';
import { FolderOpen, Users, CheckCircle2, Calendar } from 'lucide-react';
import { Project } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  completedTasks?: number;
  totalTasks?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, completedTasks = 0, totalTasks = 0 }) => {
  const navigate = useNavigate();
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 cursor-pointer hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors">
            <FolderOpen size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base leading-tight group-hover:text-indigo-300 transition-colors">
              {project.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">{formatDate(project.createdAt)}</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-indigo-400 bg-indigo-600/10 px-2 py-1 rounded-full border border-indigo-500/20">
          {progress}%
        </span>
      </div>

      {project.description && (
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} tasks</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Users size={14} />
          <span className="text-xs">{project._count?.members ?? 0} members</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <CheckCircle2 size={14} />
          <span className="text-xs">{totalTasks} tasks</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
          <Calendar size={13} />
          <span className="text-xs">{formatDate(project.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
