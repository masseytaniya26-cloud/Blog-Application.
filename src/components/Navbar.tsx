import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { PageView, ThemeMode, User } from '../types';
import { getInitials } from '../utils/reading';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  user: User | null;
  onOpenSignIn: () => void;
  onSignOut: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  draftCount: number;
}

export function Navbar({
  currentView,
  onNavigate,
  user,
  onOpenSignIn,
  onSignOut,
  theme,
  onToggleTheme,
  draftCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navItems: { view: PageView; label: string }[] = [
    { view: 'home', label: 'Stories' },
    { view: 'leaderboard', label: 'Leaderboard' },
    { view: 'write', label: 'Write' },
    { view: 'my-stories', label: 'My Stories' },
  ];

  const handleNavClick = (view: PageView) => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="font-serif text-2xl font-bold tracking-tight text-neutral-950 dark:text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950 dark:focus-visible:outline-white"
        >
          Folio
        </button>

        {/* Zone 2: Primary Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'home' && currentView === 'read');
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNavClick(item.view)}
                className={`whitespace-nowrap shrink-0 py-1 border-b transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950 dark:focus-visible:outline-white ${
                  isActive
                    ? 'text-neutral-950 dark:text-white border-neutral-950 dark:border-white'
                    : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                aria-expanded={accountMenuOpen}
                className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white"
              >
                <span className="font-mono text-xs opacity-80">{getInitials(user.name)}</span>
                <span className="max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-sm font-medium text-neutral-950 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleNavClick('write')}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      New story
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavClick('my-stories')}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>My stories</span>
                      {draftCount > 0 && (
                        <span className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                          {draftCount} draft{draftCount === 1 ? '' : 's'}
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white"
            >
              Sign in
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-11 h-11 inline-flex items-center justify-center rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                currentView === item.view ||
                (item.view === 'home' && currentView === 'read');
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
