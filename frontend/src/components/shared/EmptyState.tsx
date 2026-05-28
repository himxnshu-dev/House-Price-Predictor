import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 fade-in">
      <div className="h-16 w-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                    flex items-center justify-center mb-6">
        <Icon className="h-7 w-7 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  );
}
