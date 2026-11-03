import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white border-slate-700';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          bg = 'bg-emerald-950 text-emerald-100 border-emerald-700 shadow-emerald-950/40';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950 text-amber-100 border-amber-700 shadow-amber-950/40';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start space-x-3 transition-all animate-in slide-in-from-right duration-200 ${bg}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 pr-1">
              <h5 className="font-bold text-xs">{toast.title}</h5>
              <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white transition p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
