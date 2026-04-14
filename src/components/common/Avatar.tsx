import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const Avatar = ({ 
  src, 
  firstName, 
  lastName, 
  size = 'default',
  className 
}: AvatarProps) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    default: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={cn(
          sizes[size],
          'rounded-xl object-cover ring-2 ring-white shadow-sm',
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        sizes[size],
        'rounded-xl bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white flex items-center justify-center font-bold ring-2 ring-white shadow-sm',
        className
      )}
    >
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  );
};

export default Avatar;
