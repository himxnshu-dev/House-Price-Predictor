import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Clock,
  Star,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Activity,
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Predict', icon: LayoutDashboard },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/favorites', label: 'Favorites', icon: Star },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center
                          shadow-[0_0_20px_rgba(94,106,210,0.3)] group-hover:shadow-[0_0_30px_rgba(94,106,210,0.4)]
                          transition-all duration-300">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
              PriceVision
            </span>
          </Link>

          {/* Nav Links (authenticated) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                                   text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                                   hover:bg-[var(--bg-hover)] transition-all duration-200">
                    <div className="h-7 w-7 rounded-full bg-[var(--accent-primary)]/20
                                  flex items-center justify-center border border-[var(--accent-primary)]/30">
                      <User className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-[var(--bg-elevated)] border-[var(--border-subtle)]"
                >
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />

                  {/* Mobile nav links */}
                  <div className="md:hidden">
                    {navLinks.map(({ to, label, icon: Icon }) => (
                      <DropdownMenuItem
                        key={to}
                        onClick={() => navigate(to)}
                        className="cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                                 focus:bg-[var(--bg-hover)] focus:text-[var(--text-primary)]"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
                  </div>

                  <DropdownMenuItem
                    onClick={() => navigate('/settings')}
                    className="cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                             focus:bg-[var(--bg-hover)] focus:text-[var(--text-primary)]"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[var(--border-subtle)]" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-[var(--error)] focus:bg-[var(--error)]/10
                             focus:text-[var(--error)]"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)]
                           hover:text-[var(--text-primary)] transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent-primary)]
                           rounded-lg hover:bg-[var(--accent-primary)]/90
                           shadow-[0_0_20px_rgba(94,106,210,0.2)]
                           hover:shadow-[0_0_30px_rgba(94,106,210,0.3)]
                           transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
