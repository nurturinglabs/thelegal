'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function Toast({
  type = 'info',
  message,
  duration = 3000,
  onClose,
  action,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  const colorStyles = {
    success: 'bg-success/10 border-success/20 text-success',
    error: 'bg-error/10 border-error/20 text-error',
    info: 'bg-primary/10 border-primary/20 text-primary',
    warning: 'bg-warning/10 border-warning/20 text-warning',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-down',
        colorStyles[type]
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-textPrimary">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium hover:underline"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={onClose}
        className="flex-shrink-0 text-textMuted hover:text-textPrimary transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
