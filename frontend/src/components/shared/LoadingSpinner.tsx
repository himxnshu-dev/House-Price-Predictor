import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative">
        <Loader2
          className={`${sizeClasses[size]} animate-spin text-[var(--accent-primary)]`}
        />
        <div className="absolute inset-0 animate-ping opacity-20">
          <Loader2
            className={`${sizeClasses[size]} text-[var(--accent-primary)]`}
          />
        </div>
      </div>
      {text && (
        <p className="text-sm text-[var(--text-secondary)] animate-pulse">{text}</p>
      )}
    </div>
  );
}
