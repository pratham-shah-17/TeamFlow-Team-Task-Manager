import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  change?: number;
  changeLabel?: string;
  progress?: number;
  suffix?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-indigo-400',
  iconBg = 'bg-indigo-500/10',
  change,
  changeLabel,
  progress,
  suffix,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5
        hover:bg-white/[0.07] hover:border-white/15 transition-all duration-200
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400 font-medium mb-0.5">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center border border-white/5`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      {/* Change indicator */}
      {typeof change !== 'undefined' && (
        <div className="flex items-center gap-1.5 mb-3">
          {change >= 0 ? (
            <TrendingUp size={14} className="text-emerald-400" />
          ) : (
            <TrendingDown size={14} className="text-rose-400" />
          )}
          <span className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-xs text-slate-500">{changeLabel}</span>
          )}
        </div>
      )}

      {/* Progress bar */}
      {typeof progress !== 'undefined' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Progress</span>
            <span className="text-xs font-medium text-slate-300">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
