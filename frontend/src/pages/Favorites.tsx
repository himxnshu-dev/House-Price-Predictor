import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionService } from '@/services/prediction.service';
import PredictionCard from '@/components/shared/PredictionCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => predictionService.getFavorites(),
  });

  const favoriteMutation = useMutation({
    mutationFn: (id: string) => predictionService.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  const handleFavoriteToggle = async (id: string) => {
    await favoriteMutation.mutateAsync(id);
  };

  const favorites = data?.favorites || [];

  if (isLoading) {
    return <LoadingSpinner text="Loading favorites..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Favorites</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {favorites.length > 0
            ? `${favorites.length} saved prediction${favorites.length === 1 ? '' : 's'}`
            : 'Your starred property valuations'}
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20 mb-6">
          <p className="text-sm text-[var(--error)]">Failed to load favorites. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {favorites.length === 0 && !isLoading && !isError && (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          description="Star a prediction to save it here for quick access."
          action={
            <Link
              to="/history"
              className="px-5 py-2.5 rounded-lg text-sm font-medium
                       bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]
                       hover:bg-[var(--bg-hover)]
                       transition-all duration-300"
            >
              Browse History
            </Link>
          }
        />
      )}

      {/* Card Grid */}
      {favorites.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((prediction) => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
