import React from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';
import { updateTask } from '../../api/tasks.api';
import { useToast } from '../../hooks/useToast';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  onTaskClick?: (task: Task) => void;
}

const COLUMNS: { status: TaskStatus; label: string; color: string; bg: string }[] = [
  { status: 'TODO', label: 'To Do', color: 'text-slate-400', bg: 'bg-slate-700/30' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'text-indigo-400', bg: 'bg-indigo-900/20' },
  { status: 'REVIEW', label: 'Review', color: 'text-amber-400', bg: 'bg-amber-900/20' },
  { status: 'COMPLETED', label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
];

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated, onTaskClick }) => {
  const toast = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const validStatuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
    if (!validStatuses.includes(newStatus)) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await updateTask(taskId, { status: newStatus });
      onTaskUpdated();
      toast.success(`Task moved to ${COLUMNS.find(c => c.status === newStatus)?.label}`);
    } catch {
      toast.error('Failed to update task status');
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = getTasksByStatus(col.status);
          return (
            <div
              key={col.status}
              id={col.status}
              className={`rounded-xl border border-slate-700/50 p-4 min-h-[300px] ${col.bg}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </h3>
                <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No tasks here
                  </div>
                ) : (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick?.(task)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

export default TaskList;
