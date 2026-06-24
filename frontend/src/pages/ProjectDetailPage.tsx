import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Users,
  CheckSquare,
  Trash2,
  Edit,
  UserPlus,
  Search,
  Filter,
} from 'lucide-react';
import { getProject, updateProject, deleteProject, getMembers, addMember, removeMember } from '../api/projects.api';
import { getTasks, createTask } from '../api/tasks.api';
import type { Project, ProjectMember, Task, TaskStatus, Priority } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import MemberList from '../components/projects/MemberList';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Spinner';
import Select from '../components/ui/Select';

type TabType = 'tasks' | 'members';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const toast = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [isLoading, setIsLoading] = useState(true);
  const [taskSearch, setTaskSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showRemoveMember, setShowRemoveMember] = useState<{ userId: string; name: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [projectData, membersData, tasksData] = await Promise.all([
        getProject(id),
        getMembers(id),
        getTasks({ projectId: id }),
      ]);
      setProject(projectData);
      setMembers(membersData);
      setTasks(tasksData);
    } catch {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      !taskSearch ||
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description?.toLowerCase().includes(taskSearch.toLowerCase()) ?? false);
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchPriority = !priorityFilter || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    assignedToId?: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: string;
  }) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const newTask = await createTask({ ...data, projectId: id });
      setTasks((prev) => [...prev, newTask]);
      setShowCreateTask(false);
      toast.success('Task created successfully!');
    } catch {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async () => {
    if (!id || !memberEmail.trim()) return;
    setIsSubmitting(true);
    try {
      const newMember = await addMember(id, { email: memberEmail.trim() });
      setMembers((prev) => [...prev, newMember]);
      setShowAddMember(false);
      setMemberEmail('');
      toast.success('Member added successfully!');
    } catch {
      toast.error('Failed to add member. Check if the email is correct.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!id || !showRemoveMember) return;
    setIsSubmitting(true);
    try {
      await removeMember(id, showRemoveMember.userId);
      setMembers((prev) => prev.filter((m) => m.userId !== showRemoveMember.userId));
      setShowRemoveMember(null);
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (data: { title: string; description?: string }) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const updated = await updateProject(id, data);
      setProject(updated);
      setShowEditProject(false);
      toast.success('Project updated!');
    } catch {
      toast.error('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch {
      toast.error('Failed to delete project');
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (!project) return null;

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'REVIEW', label: 'Review' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'Projects', path: '/projects' },
          { label: project.title },
        ]}
      />

      {/* Project Header */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white mb-1 truncate">{project.title}</h1>
            {project.description && (
              <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Edit size={14} />}
                onClick={() => setShowEditProject(true)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                onClick={() => setShowDeleteProject(true)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-700/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{members.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalTasks}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{completedTasks}</p>
            <p className="text-xs text-slate-500 mt-0.5">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{progress}%</p>
            <p className="text-xs text-slate-500 mt-0.5">Progress</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700/50">
        <div className="flex gap-1">
          {[
            { key: 'tasks', label: 'Tasks', icon: CheckSquare, count: totalTasks },
            { key: 'members', label: 'Members', icon: Users, count: members.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                  activeTab === tab.key
                    ? 'bg-indigo-900/60 text-indigo-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 flex-1">
              <div className="w-full sm:w-56">
                <Input
                  placeholder="Search tasks..."
                  leftIcon={<Search size={14} />}
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                />
              </div>
              <div className="w-36">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
              <div className="w-36">
                <Select
                  options={priorityOptions}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                />
              </div>
            </div>
            {isAdmin && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => setShowCreateTask(true)}
              >
                Add Task
              </Button>
            )}
          </div>

          {filteredTasks.length === 0 && (taskSearch || statusFilter || priorityFilter) ? (
            <EmptyState
              icon={Filter}
              title="No tasks match your filters"
              description="Try adjusting your search or filter criteria."
            />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks yet"
              description={isAdmin ? 'Create the first task for this project.' : 'No tasks have been created yet.'}
              action={isAdmin ? { label: 'Create Task', onClick: () => setShowCreateTask(true), icon: Plus } : undefined}
            />
          ) : (
            <TaskList tasks={filteredTasks} onTaskUpdated={fetchData} />
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{members.length} member{members.length !== 1 ? 's' : ''}</p>
            {isAdmin && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserPlus size={14} />}
                onClick={() => setShowAddMember(true)}
              >
                Add Member
              </Button>
            )}
          </div>

          {members.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members yet"
              description="Add team members to collaborate on this project."
              action={isAdmin ? { label: 'Add Member', onClick: () => setShowAddMember(true), icon: UserPlus } : undefined}
            />
          ) : (
            <MemberList
              members={members}
              isAdmin={isAdmin}
              currentUserId={user?.id}
              onRemove={async (userId) => {
                const member = members.find(m => m.user.id === userId);
                if (member) {
                  setShowRemoveMember({ userId, name: member.user.name });
                }
              }}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showCreateTask} onClose={() => setShowCreateTask(false)} title="Create Task" size="md">
        <TaskForm
          members={members}
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateTask(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal isOpen={showEditProject} onClose={() => setShowEditProject(false)} title="Edit Project" size="md">
        <ProjectForm
          defaultValues={{ title: project.title, description: project.description }}
          onSubmit={handleUpdateProject}
          onCancel={() => setShowEditProject(false)}
          isLoading={isSubmitting}
          mode="edit"
        />
      </Modal>

      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Member" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400">
            Enter the email address of the user you want to add to this project.
          </p>
          <Input
            label="Email address"
            type="email"
            placeholder="member@company.com"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddMember(); }}
          />
          <div className="flex justify-end gap-3 border-t border-slate-700/50 pt-4">
            <Button variant="secondary" onClick={() => setShowAddMember(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddMember} loading={isSubmitting} disabled={!memberEmail.trim()}>
              Add Member
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.title}"? This will permanently delete all tasks and data.`}
        confirmLabel="Delete Project"
        isLoading={isSubmitting}
      />

      <ConfirmModal
        isOpen={!!showRemoveMember}
        onClose={() => setShowRemoveMember(null)}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${showRemoveMember?.name} from this project?`}
        confirmLabel="Remove"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ProjectDetailPage;
