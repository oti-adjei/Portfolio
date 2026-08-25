import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon = 'ri-inbox-line', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-11 h-11 rounded-full bg-cream-surface inline-flex items-center justify-center text-gray-400">
        <i className={`${icon} text-xl`} aria-hidden="true" />
      </div>
      <p className="mt-3 text-[14px] font-medium text-gray-900">{title}</p>
      {description && <p className="mt-1 text-[13px] text-gray-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
