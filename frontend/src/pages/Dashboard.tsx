import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionService } from '@/services/prediction.service';
import FavoriteToggle from '@/components/shared/FavoriteToggle';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Loader2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronDown,
} from 'lucide-react';
import { isAxiosError } from 'axios';
import type { PredictionInput, PredictionResult } from '@/types';

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Form state
  const [location, setLocation] = useState('');
  const [bhk, setBhk] = useState(2);
  const [bath, setBath] = useState(2);
  const [totalSqft, setTotalSqft] = useState(1200);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Location combobox state
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Result state
  const [result, setResult] = useState<(PredictionResult & { input?: PredictionInput }) | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch locations
  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => predictionService.getLocations(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const locations = locationsData?.locations || [];
  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Predict mutation
  const predictMutation = useMutation({
    mutationFn: (input: PredictionInput) => predictionService.predict(input),
    onSuccess: (data, variables) => {
      setResult({ ...data, input: variables });
      setPredictionId(null);
      setIsFavorited(false);
      // Invalidate history so it picks up the new prediction
      queryClient.invalidateQueries({ queryKey: ['history'] });

      // Try to find the prediction ID from history after a short delay
      // (prediction is saved asynchronously on the backend)
      setTimeout(async () => {
        try {
          const historyData = await predictionService.getHistory(1, 1);
          if (historyData.history.length > 0) {
            const latest = historyData.history[0];
            // Verify it matches our prediction
            if (
              latest.location === variables.location &&
              latest.bhk === variables.bhk &&
              Math.abs(latest.predictedPrice - (data.price_lakhs || 0)) < 0.01
            ) {
              setPredictionId(latest.id);
              setIsFavorited(latest.isFavorite);
            }
          }
        } catch {
          // Silently fail — favorite toggle just won't work for this prediction
        }
      }, 1500);
    },
  });

  // Validate form
  const validate = (): boolean => {
    const errors: string[] = [];

    if (!location) errors.push('Please select a location');
    if (bhk < 1) errors.push('BHK must be at least 1');
    if (bath < 1) errors.push('Bathrooms must be at least 1');
    if (bath > bhk + 2) errors.push(`Bathrooms cannot exceed ${bhk + 2} for a ${bhk} BHK`);
    if (totalSqft < 300) errors.push('Total area must be at least 300 sqft');
    if (totalSqft > 50000) errors.push('Total area cannot exceed 50,000 sqft');
    if (totalSqft / bhk < 300) errors.push(`Minimum ${bhk * 300} sqft required for ${bhk} BHK (300 sqft/bedroom)`);

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    predictMutation.mutate({ location, bhk, bath, total_sqft: totalSqft });
  };

  const handleFavoriteToggle = async () => {
    if (!predictionId) return;
    await predictionService.toggleFavorite(predictionId);
    setIsFavorited(!isFavorited);
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  // Derive error message for display
  const apiError = predictMutation.isError
    ? isAxiosError(predictMutation.error)
      ? predictMutation.error.response?.data?.errors ||
        predictMutation.error.response?.data?.error ||
        predictMutation.error.response?.data?.message ||
        'Prediction failed. Please try again.'
      : 'Network error. Please check your connection.'
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Property Valuation</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Enter property details to get an instant AI-powered price prediction
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* ── Left Pane: Input Form ──────────────── */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location Combobox */}
            <div ref={locationRef} className="relative">
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={location || locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setLocation('');
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Search location..."
                  className="input-minimal w-full text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                           text-sm pl-7 pr-8 focus:outline-none"
                />
                <ChevronDown className={`absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4
                  text-[var(--text-tertiary)] transition-transform duration-200
                  ${showLocationDropdown ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Location dropdown */}
              {showLocationDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                              rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                      {locations.length === 0 ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Loading locations...
                        </span>
                      ) : (
                        'No matching locations'
                      )}
                    </div>
                  ) : (
                    filteredLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocation(loc);
                          setLocationSearch('');
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                          hover:bg-[var(--bg-hover)]
                          ${location === loc
                            ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                            : 'text-[var(--text-primary)]'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <Search className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
                          {loc}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* BHK */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Bedrooms (BHK)
              </label>
              <div className="flex items-center gap-3">
                <BedDouble className="h-4 w-4 text-[var(--text-tertiary)] shrink-0" />
                <div className="flex items-center gap-2 flex-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setBhk(n);
                        if (bath > n + 2) setBath(n + 2);
                      }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${bhk === n
                          ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_15px_rgba(94,106,210,0.3)]'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--text-tertiary)]'
                        }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Bathrooms
              </label>
              <div className="flex items-center gap-3">
                <Bath className="h-4 w-4 text-[var(--text-tertiary)] shrink-0" />
                <div className="flex items-center gap-2 flex-1">
                  {Array.from({ length: bhk + 2 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setBath(n)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${bath === n
                          ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_15px_rgba(94,106,210,0.3)]'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--text-tertiary)]'
                        }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              {bath > bhk + 2 && (
                <p className="text-xs text-[var(--accent-warm)] mt-2">
                  Max {bhk + 2} bathrooms for {bhk} BHK
                </p>
              )}
            </div>

            {/* Total Sqft */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Total Area (sqft)
              </label>
              <div className="flex items-center gap-3">
                <Maximize className="h-4 w-4 text-[var(--text-tertiary)] shrink-0" />
                <input
                  type="number"
                  value={totalSqft}
                  onChange={(e) => setTotalSqft(Number(e.target.value))}
                  min={300}
                  max={50000}
                  className="input-minimal flex-1 text-[var(--text-primary)] text-sm focus:outline-none
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[var(--text-tertiary)]">Min: 300</span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {totalSqft > 0 && bhk > 0
                    ? `${Math.round(totalSqft / bhk)} sqft/bedroom`
                    : ''}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">Max: 50,000</span>
              </div>
            </div>

            {/* Validation Errors */}
            {formErrors.length > 0 && (
              <div className="p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
                {formErrors.map((err) => (
                  <p key={err} className="text-xs text-[var(--error)] mb-1 last:mb-0">• {err}</p>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={predictMutation.isPending}
              className="w-full py-3.5 bg-[var(--accent-primary)] text-white font-semibold rounded-xl
                       hover:bg-[var(--accent-primary)]/90 transition-all duration-300
                       shadow-[0_0_20px_rgba(94,106,210,0.2)]
                       hover:shadow-[0_0_30px_rgba(94,106,210,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 text-sm"
            >
              {predictMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Predict Price
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Right Pane: Output Canvas ──────────── */}
        <div className="lg:sticky lg:top-24">
          {/* Error state */}
          {apiError && !result && (
            <div className="bg-[var(--bg-surface)] border border-[var(--error)]/20 rounded-2xl p-8
                          flex flex-col items-center justify-center min-h-[400px] scale-in">
              <div className="h-14 w-14 rounded-2xl bg-[var(--error)]/10 flex items-center justify-center mb-5">
                <AlertTriangle className="h-7 w-7 text-[var(--error)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Prediction Failed</h3>
              <p className="text-sm text-[var(--text-secondary)] text-center max-w-xs mb-6">
                {apiError}
              </p>
              <button
                onClick={() => predictMutation.reset()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
                         bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]
                         hover:bg-[var(--bg-hover)] transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Success result */}
          {result?.success && result.price_lakhs !== undefined && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl
                          overflow-hidden scale-in glow-strong">
              {/* Price display */}
              <div className="p-8 sm:p-10 text-center border-b border-[var(--border-subtle)]
                            bg-gradient-to-b from-[var(--accent-primary)]/5 to-transparent">
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-4 font-medium">
                  Estimated Property Value
                </p>
                <div className="flex items-baseline justify-center gap-2 mb-3">
                  <span className="text-5xl sm:text-6xl font-bold font-mono text-[var(--text-primary)]
                                 tracking-tight drop-shadow-[0_0_20px_rgba(94,106,210,0.2)]">
                    ₹{result.price_lakhs.toFixed(2)}
                  </span>
                  <span className="text-xl text-[var(--text-secondary)] font-medium">Lakhs</span>
                </div>
                <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent" />
              </div>

              {/* Property summary */}
              <div className="p-6 sm:p-8">
                {/* Location */}
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-4 w-4 text-[var(--accent-primary)]" />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {result.input?.location}
                  </span>
                </div>

                {/* Property details */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <BedDouble className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    <span className="text-sm text-[var(--text-primary)] font-medium">
                      {result.input?.bhk} BHK
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <Bath className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-primary)] font-medium">
                      {result.input?.bath} Bath
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <Maximize className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-primary)] font-medium">
                      {result.input?.total_sqft?.toLocaleString()} sqft
                    </span>
                  </div>
                </div>

                {/* Favorite toggle */}
                {predictionId && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-elevated)]
                                border border-[var(--border-subtle)]">
                    <FavoriteToggle
                      isFavorite={isFavorited}
                      onToggle={handleFavoriteToggle}
                      size="lg"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">
                      {isFavorited ? 'Saved to favorites' : 'Save to favorites'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !apiError && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl
                          p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]
                              flex items-center justify-center"
                     style={{ animation: 'pulse-glow 4s ease-in-out infinite' }}>
                  <Sparkles className="h-8 w-8 text-[var(--text-tertiary)]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Ready to Predict
              </h3>
              <p className="text-sm text-[var(--text-secondary)] text-center max-w-xs">
                Fill in the property details on the left and click "Predict Price" to get an instant valuation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
