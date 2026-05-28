import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, TrendingUp, Clock, Star, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const features = [
  {
    icon: TrendingUp,
    title: 'ML-Powered Predictions',
    description: 'Advanced machine learning model trained on real Bangalore property data for accurate price estimation.',
  },
  {
    icon: Clock,
    title: 'Prediction History',
    description: 'Every prediction is saved automatically. Browse, search, and revisit past valuations anytime.',
  },
  {
    icon: Star,
    title: 'Save Favorites',
    description: 'Star the predictions that matter most. Quick access to your shortlisted properties.',
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(94, 106, 210, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(94, 106, 210, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glows */}
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-[var(--accent-primary)] rounded-full opacity-[0.04] blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-purple-600 rounded-full opacity-[0.03] blur-[130px]" />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-[var(--accent-primary)] rounded-full opacity-[0.02] blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20
                        mb-8 fade-in">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            <span className="text-xs font-medium text-[var(--accent-primary)] tracking-wide uppercase">
              AI-Powered Property Valuation
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="text-[var(--text-primary)]">Predict Your</span>
            <br />
            <span className="text-gradient-accent">Property's Worth</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            Get instant, ML-powered house price predictions for properties across Bangalore.
            Input the details, get the estimated value in seconds.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="group flex items-center gap-2 px-8 py-3.5 bg-[var(--accent-primary)]
                       text-white font-semibold rounded-xl text-base
                       shadow-[0_0_30px_rgba(94,106,210,0.3)]
                       hover:shadow-[0_0_50px_rgba(94,106,210,0.4)]
                       hover:bg-[var(--accent-primary)]/90
                       transition-all duration-300"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-8 py-3.5 text-[var(--text-secondary)] font-medium rounded-xl
                         text-base border border-[var(--border-subtle)]
                         hover:text-[var(--text-primary)] hover:border-[var(--text-tertiary)]
                         hover:bg-[var(--bg-hover)]
                         transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-8 sm:gap-16 mt-16 slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { value: '98%', label: 'Accuracy Rate' },
              { value: '200+', label: 'Locations' },
              { value: '<2s', label: 'Prediction Time' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
                  {value}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 tracking-wide uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6
                         hover:border-[var(--accent-primary)]/20 hover:shadow-[0_0_60px_rgba(94,106,210,0.06)]
                         transition-all duration-500 slide-up"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <div className="h-10 w-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4
                              group-hover:bg-[var(--accent-primary)]/15 transition-colors duration-300">
                  <Icon className="h-5 w-5 text-[var(--accent-primary)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-8 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[var(--accent-primary)]" />
            <span className="text-sm text-[var(--text-secondary)]">PriceVision</span>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            Built with ML • Bangalore Property Data
          </p>
        </div>
      </footer>
    </div>
  );
}
