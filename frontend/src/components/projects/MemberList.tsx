import React from 'react';
import { Trash2, Shield, User } from 'lucide-react';
import { ProjectMember } from '../../types';
import { getInitials } from '../../utils/helpers';
import Button from '../ui/Button';

interface MemberListProps {
  members: ProjectMember[];
  currentUserId?: string;
  isAdmin?: boolean;
  onRemove?: (userId: string) => Promise<void>;
  removingId?: string | null;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  currentUserId,
  isAdmin = false,
  onRemove,
  removingId = null,
}) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No members yet. Add members to collaborate.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map(member => (
        <div
          key={member.id}
          className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3 border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-semibold flex-shrink-0">
              {getInitials(member.user.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">{member.user.name}</span>
                {member.user.id === currentUserId && (
                  <span className="text-xs text-indigo-400 bg-indigo-900/30 px-1.5 py-0.5 rounded">You</span>
                )}
              </div>
              <span className="text-slate-400 text-xs">{member.user.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Role badge */}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              member.roleInProject === 'ADMIN'
                ? 'bg-amber-900/30 text-amber-400 border border-amber-500/20'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
            }`}>
              {member.roleInProject === 'ADMIN' ? <Shield size={11} /> : <User size={11} />}
              {member.roleInProject}
            </div>
            {/* Remove button (admin only, not self) */}
            {isAdmin && member.user.id !== currentUserId && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(member.user.id)}
                loading={removingId === member.user.id}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 p-1.5"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
