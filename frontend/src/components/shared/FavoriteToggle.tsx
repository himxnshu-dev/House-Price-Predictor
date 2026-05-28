import { Star, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface FavoriteToggleProps {
  isFavorite: boolean;
  onToggle: () => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteToggle({ isFavorite, onToggle, size = 'md' }: FavoriteToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`group/fav p-1.5 rounded-lg transition-all duration-300
        ${isFavorite
          ? 'text-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/10'
          : 'text-[var(--text-tertiary)] hover:text-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/10'
        }
        disabled:opacity-50`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      ) : (
        <Star
          className={`${sizeClasses[size]} transition-all duration-300
            ${isFavorite
              ? 'fill-[var(--accent-warm)] drop-shadow-[0_0_6px_rgba(245,166,35,0.4)]'
              : 'fill-transparent group-hover/fav:fill-[var(--accent-warm)]/20'
            }`}
        />
      )}
    </button>
  );
}
