import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Toast as ToastType } from '../../types';
import { useToast } from '../../hooks/useToast';

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-400',
    borderClass: 'border-l-emerald-500',
    bgClass: 'bg-slate-900',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-rose-400',
    borderClass: 'border-l-rose-500',
    bgClass: 'bg-slate-900',
  },
  info: {
    icon: Info,
    iconClass: 'text-indigo-400',
    borderClass: 'border-l-indigo-500',
    bgClass: 'bg-slate-900',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-400',
    borderClass: 'border-l-amber-500',
    bgClass: 'bg-slate-900',
  },
};

const ToastItem: React.FC<{ toast: ToastType; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3 w-full max-w-sm
        ${config.bgClass} border border-slate-700 border-l-4 ${config.borderClass}
        rounded-xl shadow-2xl p-4
        toast-enter
      `}
    >
      <Icon className={`shrink-0 mt-0.5 ${config.iconClass}`} size={18} />
      <p className="flex-1 text-sm text-slate-200 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default Toast;
