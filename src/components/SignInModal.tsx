import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../types';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: User) => void;
  contextMessage?: string;
}

export function SignInModal({
  isOpen,
  onClose,
  onSignIn,
  contextMessage,
}: SignInModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    onSignIn({
      name: trimmedName,
      email: trimmedEmail,
      signedInAt: new Date().toISOString(),
    });
    setName('');
    setEmail('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
    >
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in dialog"
          className="absolute top-4 right-4 w-10 h-10 inline-flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
          Author Byline
        </p>
        <h2
          id="signin-title"
          className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-950 dark:text-white mt-1"
        >
          Sign in to Folio
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
          {contextMessage ||
            'Enter your name and email to compose drafts, publish essays, and manage your stories. Stored locally in your browser.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="folio-signin-name"
              className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1.5"
            >
              Full name
            </label>
            <input
              id="folio-signin-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Clara Vance"
              autoFocus
              className="w-full h-11 px-3.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="folio-signin-email"
              className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1.5"
            >
              Email address
            </label>
            <input
              id="folio-signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clara@example.com"
              className="w-full h-11 px-3.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors cursor-pointer"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
