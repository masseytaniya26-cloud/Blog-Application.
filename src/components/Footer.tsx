import { PageView } from '../types';

interface FooterProps {
  onNavigate: (view: PageView) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="font-serif text-xl font-bold text-neutral-950 dark:text-white">
            Folio
          </span>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Independent Markdown essays &amp; editorial reader. All stories and preferences are saved locally in your browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Stories
          </button>
          <button
            type="button"
            onClick={() => onNavigate('leaderboard')}
            className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Leaderboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('write')}
            className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => onNavigate('my-stories')}
            className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            My Stories
          </button>
        </div>
      </div>
    </footer>
  );
}
