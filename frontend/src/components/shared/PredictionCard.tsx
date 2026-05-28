import { MapPin, Bath, BedDouble, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FavoriteToggle from './FavoriteToggle';
import type { Prediction } from '@/types';

interface PredictionCardProps {
  prediction: Prediction;
  onFavoriteToggle: (id: string) => Promise<void>;
}

export default function PredictionCard({ prediction, onFavoriteToggle }: PredictionCardProps) {
  const formattedDate = new Date(prediction.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(prediction.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="group relative bg-[var(--bg-surface)] border border-[var(--border-subtle)]
                  rounded-xl p-5 transition-all duration-300
                  hover:border-[var(--accent-primary)]/20 hover:shadow-[0_0_40px_rgba(94,106,210,0.06)]
                  hover:translate-y-[-2px]">
      {/* Favorite toggle — top right */}
      <div className="absolute top-3 right-3">
        <FavoriteToggle
          isFavorite={prediction.isFavorite}
          onToggle={() => onFavoriteToggle(prediction.id)}
          size="sm"
        />
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-4 pr-8">
        <MapPin className="h-4 w-4 text-[var(--accent-primary)] mt-0.5 shrink-0" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight line-clamp-2">
          {prediction.location}
        </h3>
      </div>

      {/* Property badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge
          variant="secondary"
          className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20
                   text-xs font-medium px-2 py-0.5"
        >
          <BedDouble className="h-3 w-3 mr-1" />
          {prediction.bhk} BHK
        </Badge>
        <Badge
          variant="secondary"
          className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]
                   text-xs font-medium px-2 py-0.5"
        >
          <Bath className="h-3 w-3 mr-1" />
          {prediction.bath} Bath
        </Badge>
        <Badge
          variant="secondary"
          className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]
                   text-xs font-medium px-2 py-0.5"
        >
          <Maximize className="h-3 w-3 mr-1" />
          {prediction.total_sqft.toLocaleString()} sqft
        </Badge>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-2xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
          ₹{prediction.predictedPrice.toFixed(2)}
        </span>
        <span className="text-sm text-[var(--text-secondary)] font-medium">Lakhs</span>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-[var(--text-tertiary)]">
        {formattedDate} • {formattedTime}
      </div>
    </div>
  );
}
