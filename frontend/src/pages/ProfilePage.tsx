import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, User, Calendar, Mail, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatDate, getInitials } from '../utils/helpers';
import api from '../api/axios';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await api.put('/auth/profile', data);
      toast.success('Profile updated! Refresh to see changes.');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">My Profile</h1>

      {/* Avatar & basic info */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {getInitials(user.name)}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-slate-400 mt-1">{user.email}</p>
          <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            user.role === 'ADMIN'
              ? 'bg-amber-900/30 text-amber-400 border border-amber-500/20'
              : 'bg-slate-700 text-slate-400 border border-slate-600'
          }`}>
            {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
            {user.role}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Mail size={15} />
            <span className="text-xs font-medium uppercase tracking-wide">Email</span>
          </div>
          <p className="text-white text-sm font-medium">{user.email}</p>
        </div>
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Calendar size={15} />
            <span className="text-xs font-medium uppercase tracking-wide">Member Since</span>
          </div>
          <p className="text-white text-sm font-medium">{formatDate(user.createdAt)}</p>
        </div>
      </div>

      {/* Edit name */}
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Edit2 size={16} className="text-indigo-400" /> Edit Display Name
          </h3>
          {!isEditing && (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your full name"
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex gap-3">
              <Button type="submit" variant="primary" loading={isLoading}>
                Save Changes
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-slate-300 text-sm">
            Current name: <span className="text-white font-medium">{user.name}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
