import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, AlertCircle, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { getTask, updateTask, deleteTask } from '../api/tasks.api';
import { getMembers } from '../api/projects.api';
import { Task, TaskStatus, ProjectMember } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import TaskStatusBadge from '../components/tasks/TaskStatusBadge';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { formatDate, isOverdue, getInitials } from '../utils/helpers';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'COMPLETED', label: 'Completed' },
];

const TaskDetailPage: React.FC = () => {
  const { id, taskId } = useParams<{ id: string; taskId: string }>();
  const { user, isAdmin: isGlobalAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchTask = async () => {
    if (!taskId) return;
    try {
      const [taskData, memberList] = await Promise.all([
        getTask(taskId),
        id ? getMembers(id) : Promise.resolve([]),
      ]);
      setTask(taskData);
      setMembers(memberList);
    } catch {
      toast.error('Failed to load task details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTask(); }, [taskId]);

  const isProjectAdmin = members.some(m => m.user.id === user?.id && m.roleInProject === 'ADMIN') || isGlobalAdmin;
  const isAssignee = task?.assignedToId === user?.id;
  const canUpdateStatus = isProjectAdmin || isAssignee;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    setStatusUpdating(true);
    try {
      const updated = await updateTask(task.id, { status: newStatus });
      setTask(updated);
      toast.success('Status updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!task) return;
    setIsUpdating(true);
    try {
      const updated = await updateTask(task.id, data);
      setTask(updated);
      setShowEditModal(false);
      toast.success('Task updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success('Task deleted');
      navigate(`/projects/${id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete task');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  if (!task) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Task not found.</p>
        <Link to={`/projects/${id}`} className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
          ← Back to project
        </Link>
      </div>
    );
  }

  const overdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'COMPLETED';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/projects" className="hover:text-indigo-400 transition-colors">Projects</Link>
        <span>/</span>
        <Link to={`/projects/${id}`} className="hover:text-indigo-400 transition-colors flex items-center gap-1">
          <ArrowLeft size={13} /> {task.project?.title ?? 'Project'}
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate max-w-[200px]">{task.title}</span>
      </div>

      {/* Task header */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <TaskStatusBadge status={task.status} />
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                task.priority === 'HIGH' ? 'bg-rose-900/30 text-rose-400 border border-rose-500/20' :
                task.priority === 'MEDIUM' ? 'bg-amber-900/30 text-amber-400 border border-amber-500/20' :
                'bg-slate-700/50 text-slate-400 border border-slate-600/30'
              }`}>
                {task.priority} PRIORITY
              </span>
              {overdue && (
                <span className="flex items-center gap-1 text-xs bg-rose-900/30 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-full">
                  <AlertCircle size={11} /> OVERDUE
                </span>
              )}
            </div>
            <h1 className={`text-2xl font-bold ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-white'}`}>
              {task.title}
            </h1>
          </div>
          {isProjectAdmin && (
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowEditModal(true)} leftIcon={<Edit size={14} />}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Tag size={16} className="text-indigo-400" /> Description
            </h2>
            {task.description ? (
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-slate-500 text-sm italic">No description provided.</p>
            )}
          </div>

          {/* Status update */}
          {canUpdateStatus && (
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-400" /> Update Status
              </h2>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    disabled={statusUpdating || task.status === opt.value}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      task.status === opt.value
                        ? 'bg-indigo-600 text-white cursor-default'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
                    } disabled:opacity-50`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Assignee */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
              <User size={13} /> Assignee
            </h3>
            {task.assignedTo ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-semibold">
                  {getInitials(task.assignedTo.name)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{task.assignedTo.name}</p>
                  <p className="text-slate-500 text-xs">{task.assignedTo.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Unassigned</p>
            )}
          </div>

          {/* Due date */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
              <Calendar size={13} /> Due Date
            </h3>
            {task.dueDate ? (
              <p className={`text-sm font-medium ${overdue ? 'text-rose-400' : 'text-white'}`}>
                {formatDate(task.dueDate)}
                {overdue && <span className="ml-2 text-rose-400 text-xs">(overdue)</span>}
              </p>
            ) : (
              <p className="text-slate-500 text-sm">No due date</p>
            )}
          </div>

          {/* Project */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-3">Project</h3>
            <Link to={`/projects/${id}`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
              {task.project?.title ?? '—'}
            </Link>
          </div>

          {/* Timestamps */}
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4 space-y-2">
            <div>
              <span className="text-slate-500 text-xs">Created</span>
              <p className="text-slate-300 text-sm">{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs">Last Updated</span>
              <p className="text-slate-300 text-sm">{formatDate(task.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Task" size="lg">
        <TaskForm
          task={task}
          members={members}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
          isLoading={isUpdating}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TaskDetailPage;
