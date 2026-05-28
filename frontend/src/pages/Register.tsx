import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isAxiosError } from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' },
        replace: true,
      });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        if (err.response?.status === 409) {
          setError(data?.message || 'User with this email already exists');
        } else if (err.response?.status === 400) {
          setError(data?.errors || data?.message || 'Validation failed');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
                      bg-[var(--accent-primary)] rounded-full opacity-[0.04] blur-[150px]" />
      </div>

      <div className="w-full max-w-md relative z-10 fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="h-9 w-9 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center
                        shadow-[0_0_30px_rgba(94,106,210,0.3)]">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-[var(--text-primary)]">PriceVision</span>
        </Link>

        {/* Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 glow">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create your account</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Start predicting property prices in seconds
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20">
              <p className="text-sm text-[var(--error)]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Himanshu Sharma"
                className="input-minimal w-full text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                         text-sm focus:outline-none"
                autoComplete="name"
                autoFocus
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-minimal w-full text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                         text-sm focus:outline-none"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-minimal w-full text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                           text-sm pr-10 focus:outline-none"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--text-tertiary)]
                           hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[var(--accent-primary)] text-white font-semibold rounded-xl
                       hover:bg-[var(--accent-primary)]/90 transition-all duration-300
                       shadow-[0_0_20px_rgba(94,106,210,0.2)]
                       hover:shadow-[0_0_30px_rgba(94,106,210,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Link to login */}
        <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80
                     font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
