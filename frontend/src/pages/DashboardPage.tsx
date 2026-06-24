import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp, Calendar } from 'lucide-react';
import { getDashboard } from '../api/dashboard.api';
import { DashboardData, Task } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import StatsCard from '../components/charts/StatsCard';
import TaskPieChart from '../components/charts/TaskPieChart';
import TaskStatusBadge from '../components/tasks/TaskStatusBadge';
import { formatDate, isOverdue } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { title: 'Total Projects', value: data.totalProjects, icon: Briefcase, iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/10' },
    { title: 'Total Tasks', value: data.totalTasks, icon: ListTodo, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10' },
    { title: 'Completed', value: data.completedTasks, icon: CheckCircle2, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10' },
    { title: 'Pending', value: data.pendingTasks, icon: Clock, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10' },
    { title: 'Overdue', value: data.overdueTasks, icon: AlertTriangle, iconColor: 'text-rose-400', iconBg: 'bg-rose-500/10' },
    { title: 'Assigned to Me', value: data.assignedToMe, icon: TrendingUp, iconColor: 'text-sky-400', iconBg: 'bg-sky-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your team today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(stat => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts + Upcoming deadlines */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TaskPieChart data={data} />
        {/* Upcoming deadlines */}
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-amber-400" />
            <h2 className="text-white font-semibold">Upcoming Deadlines</h2>
          </div>
          {data.upcomingDeadlines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <Calendar size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcomingDeadlines.map(task => (
                <Link
                  key={task.id}
                  to={`/projects/${task.projectId}`}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">
                      {task.title}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{task.project?.title}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className={`text-xs font-medium ${
                      task.dueDate && isOverdue(task.dueDate) ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {task.dueDate ? formatDate(task.dueDate) : '—'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent tasks */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent Tasks</h2>
          <Link to="/projects" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            View all projects →
          </Link>
        </div>
        {data.recentTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <ListTodo size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No tasks yet. Create a project to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentTasks.map(task => (
              <Link
                key={task.id}
                to={`/projects/${task.projectId}`}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <TaskStatusBadge status={task.status} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate group-hover:text-indigo-300 transition-colors ${
                      task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-white'
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-slate-500 text-xs">{task.project?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  {task.dueDate && (
                    <span className={`text-xs ${isOverdue(task.dueDate) && task.status !== 'COMPLETED' ? 'text-rose-400' : 'text-slate-500'}`}>
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.assignedTo && (
                    <div className="w-6 h-6 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-semibold">
                      {task.assignedTo.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
