import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getStatusColors } from '../../utils/helpers';

interface BadgeProps {
  children?: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  status?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const Badge = ({ 
  children, 
  variant = 'default', 
  status,
  size = 'default',
  className 
}: BadgeProps) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-[#7B0080]/10 text-[#7B0080]',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  };

  const statusColors = status ? getStatusColors(status) : null;
  const colorClasses = statusColors 
    ? `${statusColors.bg} ${statusColors.text}` 
    : variants[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full',
        colorClasses,
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
