import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7B0080]/20 focus:ring-[#7B0080]/50',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-[#7B0080]/30 hover:text-[#7B0080] hover:bg-slate-50 focus:ring-[#7B0080]/30',
    ghost: 'text-slate-600 hover:text-[#7B0080] hover:bg-[#7B0080]/5',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg focus:ring-red-500/50',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg focus:ring-emerald-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    icon: 'p-2',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
