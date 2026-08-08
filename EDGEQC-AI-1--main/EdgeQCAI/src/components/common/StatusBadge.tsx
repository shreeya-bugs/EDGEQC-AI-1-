import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { DefectType } from '../../types';

interface StatusBadgeProps {
  status: 'PASS' | 'FAIL' | 'WARNING' | DefectType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const isPass = status === 'PASS';
  const isWarning = status === 'WARNING';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded',
    md: 'px-2.5 py-1 text-xs font-bold rounded-md',
    lg: 'px-4 py-2 text-base font-bold rounded-lg',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  if (isPass) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 ${sizeClasses[size]}`}
      >
        {showIcon && <CheckCircle2 size={iconSizes[size]} className="text-emerald-600 shrink-0" />}
        PASS
      </span>
    );
  }

  if (isWarning) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 ${sizeClasses[size]}`}
      >
        {showIcon && <AlertTriangle size={iconSizes[size]} className="text-amber-600 shrink-0" />}
        RECURRING ALERT
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-red-100 text-red-800 border border-red-300 ${sizeClasses[size]}`}
    >
      {showIcon && <XCircle size={iconSizes[size]} className="text-red-600 shrink-0" />}
      {status === 'FAIL' ? 'FAIL' : `FAIL: ${status}`}
    </span>
  );
};
