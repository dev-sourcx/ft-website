import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const Loader = ({ size = 'default', className = '' }: LoaderProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} text-[#7B0080] animate-spin`} />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center animate-fadeIn">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#7B0080] animate-spin mx-auto" />
        </div>
        <p className="mt-6 text-slate-500 font-medium font-heading">Loading...</p>
      </div>
    </div>
  );
};

export const CardLoader = () => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded-full w-1/2 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded-full w-2/3"></div>
    </div>
  );
};

export default Loader;
