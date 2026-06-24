import React, { useEffect, useState } from 'react';
import { Search, Shield, User } from 'lucide-react';
import { getAllUsers } from '../api/users.api';
import { User as UserType } from '../types';
import { useToast } from '../hooks/useToast';
import { formatDate, getInitials } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const TeamPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch {
        toast.error('Failed to load team members');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Members</h1>
        <p className="text-slate-400 mt-1">{users.length} member{users.length !== 1 ? 's' : ''} registered</p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search members by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={User}
          title="No members found"
          description={search ? 'No members match your search' : 'No team members yet'}
        />
      ) : (
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {filtered.map(u => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300 font-semibold text-sm flex-shrink-0">
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{u.name}</p>
                    <p className="text-slate-400 text-xs">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 text-xs hidden sm:block">
                    Joined {formatDate(u.createdAt)}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.role === 'ADMIN'
                      ? 'bg-amber-900/30 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {u.role === 'ADMIN' ? <Shield size={11} /> : <User size={11} />}
                    {u.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
