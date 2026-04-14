import React, { ReactNode } from 'react';
import { BookOpen, Users, Search, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  type?: 'default' | 'teachers' | 'bookings' | 'search';
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
}

const EmptyState = ({ 
  type = 'default',
  title,
  description,
  action,
  icon: CustomIcon
}: EmptyStateProps) => {
  const icons = {
    default: BookOpen,
    teachers: Users,
    bookings: BookOpen,
    search: Search,
  };

  const Icon = CustomIcon || icons[type] || icons.default;

  const defaultContent = {
    default: {
      title: 'No data found',
      description: 'There\'s nothing here yet.',
    },
    teachers: {
      title: 'No teachers found',
      description: 'Try adjusting your filters or search terms.',
    },
    bookings: {
      title: 'No bookings yet',
      description: 'Book a session with a teacher to get started.',
    },
    search: {
      title: 'No results found',
      description: 'We couldn\'t find what you\'re looking for.',
    },
  };

  const content = defaultContent[type] || defaultContent.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-[#7B0080]/10 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#7B0080]" />
      </div>
      <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">
        {title || content.title}
      </h3>
      <p className="text-slate-500 text-center max-w-sm mb-6">
        {description || content.description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
