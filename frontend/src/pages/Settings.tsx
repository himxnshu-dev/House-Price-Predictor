import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { clearTokens } from '@/lib/axios';
import {
  User,
  Shield,
  Calendar,
  Loader2,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { isAxiosError } from 'axios';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Name update
  const [name, setName] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess('');

    if (!name.trim()) {
      setNameError('Name cannot be empty');
      return;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    if (name.trim() === user?.name) {
      setNameError('Name is unchanged');
      return;
    }

    setIsUpdatingName(true);
    try {
      const response = await userService.updateName(name.trim());
      updateUser({ name: response.user.name });
      setNameSuccess('Name updated successfully');
      setTimeout(() => setNameSuccess(''), 3000);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        setNameError(data?.errors || data?.message || 'Failed to update name');
      } else {
        setNameError('Network error');
      }
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!oldPassword || !newPassword) {
      setPasswordError('Please fill in both fields');
      return;
    }
    if (oldPassword.length < 6 || newPassword.length < 6) {
      setPasswordError('Passwords must be at least 6 characters');
      return;
    }
    if (oldPassword === newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword(oldPassword, newPassword);
      // Per API docs: all tokens are invalidated after password change
      clearTokens();
      logout();
      navigate('/login', {
        state: { message: 'Password changed successfully. Please sign in with your new password.' },
        replace: true,
      });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        if (err.response?.status === 401) {
          setPasswordError(data?.message || 'Current password is incorrect');
        } else {
          setPasswordError(data?.errors || data?.message || 'Failed to change password');
        }
      } else {
        setPasswordError('Network error');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your profile and security
        </p>
      </div>

      <div className="space-y-6">
        {/* ── Profile Section ──────────────────── */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
              <User className="h-4.5 w-4.5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Profile</h2>
              <p className="text-xs text-[var(--text-secondary)]">Update your display name</p>
            </div>
          </div>

          <form onSubmit={handleNameUpdate} className="space-y-5">
            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="text-sm text-[var(--text-tertiary)] py-3 border-b border-[var(--border-subtle)]">
                {user?.email}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-minimal w-full text-[var(--text-primary)] text-sm focus:outline-none"
                maxLength={100}
              />
            </div>

            {/* Name feedback */}
            {nameError && (
              <p className="text-xs text-[var(--error)]">{nameError}</p>
            )}
            {nameSuccess && (
              <p className="text-xs text-[var(--success)] flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                {nameSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={isUpdatingName || name.trim() === user?.name}
              className="px-5 py-2.5 bg-[var(--accent-primary)] text-white text-sm font-medium rounded-lg
                       hover:bg-[var(--accent-primary)]/90 transition-all duration-300
                       shadow-[0_0_15px_rgba(94,106,210,0.15)]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              {isUpdatingName ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>

        {/* ── Security Section ─────────────────── */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-lg bg-[var(--accent-warm)]/10 flex items-center justify-center">
              <Shield className="h-4.5 w-4.5 text-[var(--accent-warm)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Security</h2>
              <p className="text-xs text-[var(--text-secondary)]">Change your password</p>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--accent-warm)]/5
                        border border-[var(--accent-warm)]/10 mb-6">
            <AlertTriangle className="h-4 w-4 text-[var(--accent-warm)] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Changing your password will sign you out of all devices. You will need to log in again.
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-minimal w-full text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                           text-sm pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--text-tertiary)]
                           hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-minimal w-full text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]
                           text-sm pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--text-tertiary)]
                           hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password error */}
            {passwordError && (
              <p className="text-xs text-[var(--error)]">{passwordError}</p>
            )}

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm font-medium
                       rounded-lg border border-[var(--border-subtle)]
                       hover:bg-[var(--bg-hover)] transition-all duration-300
                       disabled:opacity-40 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>

        {/* ── Account Info Section ─────────────── */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center">
              <Calendar className="h-4.5 w-4.5 text-[var(--text-secondary)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Account</h2>
              <p className="text-xs text-[var(--text-secondary)]">Account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <span className="text-sm text-[var(--text-secondary)]">Member since</span>
              <span className="text-sm text-[var(--text-primary)] font-medium">{memberSince}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-[var(--text-secondary)]">Account ID</span>
              <span className="text-xs text-[var(--text-tertiary)] font-mono">
                {user?.id ? `${user.id.slice(0, 8)}...${user.id.slice(-4)}` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
