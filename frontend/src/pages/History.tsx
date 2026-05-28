import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionService } from '@/services/prediction.service';
import PredictionCard from '@/components/shared/PredictionCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;

export default function History() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', page],
    queryFn: () => predictionService.getHistory(page, ITEMS_PER_PAGE),
  });

  const favoriteMutation = useMutation({
    mutationFn: (id: string) => predictionService.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleFavoriteToggle = async (id: string) => {
    await favoriteMutation.mutateAsync(id);
  };

  const history = data?.history || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  if (isLoading) {
    return <LoadingSpinner text="Loading prediction history..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Prediction History</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {meta ? `${meta.totalRecords} total predictions` : 'Your past property valuations'}
          </p>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="p-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20 mb-6">
          <p className="text-sm text-[var(--error)]">Failed to load history. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {history.length === 0 && !isLoading && !isError && (
        <EmptyState
          icon={Clock}
          title="No predictions yet"
          description="Start predicting property prices to see your history here."
          action={
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-lg text-sm font-medium
                       bg-[var(--accent-primary)] text-white
                       hover:bg-[var(--accent-primary)]/90
                       shadow-[0_0_20px_rgba(94,106,210,0.2)]
                       transition-all duration-300"
            >
              Make a Prediction
            </Link>
          }
        />
      )}

      {/* Card Grid */}
      {history.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
                         bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]
                         hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition-all duration-200
                        ${page === pageNum
                          ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_15px_rgba(94,106,210,0.3)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
                         bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]
                         hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
