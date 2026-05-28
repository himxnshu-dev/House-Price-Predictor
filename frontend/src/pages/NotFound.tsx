import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center px-4">
      <div className="text-center fade-in">
        {/* 404 */}
        <h1 className="text-8xl sm:text-9xl font-bold font-mono text-[var(--text-tertiary)]/30 tracking-tighter mb-4">
          404
        </h1>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
          Page not found
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
                     bg-[var(--accent-primary)] text-white
                     hover:bg-[var(--accent-primary)]/90
                     shadow-[0_0_20px_rgba(94,106,210,0.2)]
                     transition-all duration-300"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
                     bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]
                     hover:bg-[var(--bg-hover)]
                     transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
