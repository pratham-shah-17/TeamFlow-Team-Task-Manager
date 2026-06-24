import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { DashboardData } from '../../types';

interface TaskPieChartProps {
  data: DashboardData;
}

const COLORS = {
  TODO: '#64748b',
  IN_PROGRESS: '#6366f1',
  REVIEW: '#f59e0b',
  COMPLETED: '#10b981',
};

const LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'In Review',
  COMPLETED: 'Completed',
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{name: string; value: number; payload: {color: string}}> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-sm font-medium text-white">{payload[0].name}</p>
        <p className="text-sm text-slate-300">
          <span className="font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value}
          </span>{' '}
          tasks
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: { payload?: Array<{value: string; color: string}> }) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-slate-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const TaskPieChart: React.FC<TaskPieChartProps> = ({ data }) => {
  const chartData = [
    {
      name: LABELS.TODO,
      value: data.totalTasks - data.completedTasks - (data.pendingTasks - data.totalTasks + data.completedTasks) < 0 ? 0 : data.totalTasks - data.completedTasks,
      color: COLORS.TODO,
    },
    {
      name: LABELS.IN_PROGRESS,
      value: Math.max(0, data.pendingTasks - data.overdueTasks),
      color: COLORS.IN_PROGRESS,
    },
    {
      name: LABELS.REVIEW,
      value: data.overdueTasks,
      color: COLORS.REVIEW,
    },
    {
      name: LABELS.COMPLETED,
      value: data.completedTasks,
      color: COLORS.COMPLETED,
    },
  ].filter((d) => d.value > 0);

  const hasData = data.totalTasks > 0;

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Task Distribution</h3>
        <p className="text-sm text-slate-500">Overview of all tasks by status</p>
      </div>

      {hasData ? (
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-8px' }}>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{data.completionPercentage}%</p>
              <p className="text-xs text-slate-500">Complete</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-slate-500 text-sm">No tasks yet</p>
        </div>
      )}
    </div>
  );
};

export default TaskPieChart;
