import { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { Post, User } from '../types';
import { estimateReadingTime, formatEditorialDate } from '../utils/reading';

interface LeaderboardPageProps {
  posts: Post[];
  user: User | null;
  applaudedIds: string[];
  onReadPost: (postId: string) => void;
  onToggleApplause: (postId: string) => void;
  onWriteNew: () => void;
}

type SortMetric = 'score' | 'views' | 'applause';

interface WriterStanding {
  name: string;
  email: string;
  publishedCount: number;
  totalViews: number;
  totalApplause: number;
  score: number;
}

export function LeaderboardPage({
  posts,
  user,
  applaudedIds,
  onReadPost,
  onToggleApplause,
  onWriteNew,
}: LeaderboardPageProps) {
  const [sortBy, setSortBy] = useState<SortMetric>('score');

  const publishedPosts = useMemo(
    () => posts.filter((p) => p.status === 'published'),
    [posts]
  );

  const writerStandings = useMemo(() => {
    const map = new Map<string, WriterStanding>();
    for (const post of publishedPosts) {
      const key = post.authorEmail.toLowerCase();
      const score = post.views + post.applause * 5;
      const existing = map.get(key);
      if (existing) {
        existing.publishedCount += 1;
        existing.totalViews += post.views;
        existing.totalApplause += post.applause;
        existing.score += score;
      } else {
        map.set(key, {
          name: post.authorName,
          email: post.authorEmail,
          publishedCount: 1,
          totalViews: post.views,
          totalApplause: post.applause,
          score,
        });
      }
    }

    return [...map.values()].sort((a, b) => {
      if (sortBy === 'views') return b.totalViews - a.totalViews;
      if (sortBy === 'applause') return b.totalApplause - a.totalApplause;
      return b.score - a.score;
    });
  }, [publishedPosts, sortBy]);

  const rankedPosts = useMemo(() => {
    return [...publishedPosts].sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'applause') return b.applause - a.applause;
      return b.views + b.applause * 5 - (a.views + a.applause * 5);
    });
  }, [publishedPosts, sortBy]);

  const totalReads = publishedPosts.reduce((sum, p) => sum + p.views, 0);
  const totalRecommends = publishedPosts.reduce((sum, p) => sum + p.applause, 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            Community Standings
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-950 dark:text-white mt-2">
            Folio Leaderboards
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl leading-relaxed">
            Live rankings of independent writers and essays based on total reads and reader recommendations. Score combines reads plus five points per recommendation.
          </p>
        </div>

        {/* Interactive Sort Tabs */}
        <div
          role="tablist"
          aria-label="Rank leaderboard by"
          className="inline-flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start lg:self-auto"
        >
          {(
            [
              { id: 'score', label: 'Combined Score' },
              { id: 'views', label: 'Most Read' },
              { id: 'applause', label: 'Recommended' },
            ] as const
          ).map((option) => {
            const active = sortBy === option.id;
            return (
              <button
                key={option.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setSortBy(option.id)}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Published Essays</p>
          <p className="font-mono text-2xl font-medium tabular-nums text-neutral-950 dark:text-white mt-1">
            {publishedPosts.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Active Writers</p>
          <p className="font-mono text-2xl font-medium tabular-nums text-neutral-950 dark:text-white mt-1">
            {writerStandings.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Cumulative Reads</p>
          <p className="font-mono text-2xl font-medium tabular-nums text-neutral-950 dark:text-white mt-1">
            {totalReads.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Recommendations</p>
          <p className="font-mono text-2xl font-medium tabular-nums text-neutral-950 dark:text-white mt-1">
            {totalRecommends.toLocaleString()}
          </p>
        </div>
      </div>

      {publishedPosts.length === 0 ? (
        <div className="mt-12 py-16 text-center rounded-xl border border-neutral-200 dark:border-neutral-800">
          <h2 className="font-serif text-2xl font-semibold text-neutral-950 dark:text-white">
            No published stories to rank yet
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Publish your first Markdown essay to open the leaderboard.
          </p>
          <button
            type="button"
            onClick={onWriteNew}
            className="mt-6 h-10 px-5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors cursor-pointer"
          >
            Write a story
          </button>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          {/* Section 1: Writers Leaderboard */}
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-serif text-2xl font-semibold text-neutral-950 dark:text-white">
                Top Writers
              </h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Ranked across all published essays
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                    <th className="py-3.5 px-4 font-medium w-16">Rank</th>
                    <th className="py-3.5 px-4 font-medium">Writer</th>
                    <th className="py-3.5 px-4 font-medium text-right">Essays</th>
                    <th className="py-3.5 px-4 font-medium text-right">Reads</th>
                    <th className="py-3.5 px-4 font-medium text-right">Recommends</th>
                    <th className="py-3.5 px-4 font-medium text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-sm">
                  {writerStandings.map((writer, index) => {
                    const isCurrentUser =
                      user &&
                      user.email.toLowerCase() === writer.email.toLowerCase();
                    return (
                      <tr
                        key={writer.email}
                        className={
                          isCurrentUser
                            ? 'bg-neutral-50 dark:bg-neutral-900/70'
                            : 'hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors'
                        }
                      >
                        <td className="py-4 px-4 font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-neutral-950 dark:text-white">
                            {writer.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {writer.email}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                          {writer.publishedCount}
                        </td>
                        <td className="py-4 px-4 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                          {writer.totalViews.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                          {writer.totalApplause.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-medium tabular-nums text-neutral-950 dark:text-white">
                          {writer.score.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Top Essays */}
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-serif text-2xl font-semibold text-neutral-950 dark:text-white">
                Top Essays
              </h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Click any title to read or recommend
              </span>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
              {rankedPosts.map((post, index) => {
                const applauded = applaudedIds.includes(post.id);
                const score = post.views + post.applause * 5;
                return (
                  <div
                    key={post.id}
                    className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 sm:gap-6 min-w-0">
                      <span className="font-mono text-sm tabular-nums text-neutral-400 dark:text-neutral-500 pt-1 w-7 shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {post.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{post.authorName}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {formatEditorialDate(post.publishedAt || post.updatedAt)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{estimateReadingTime(post.content)} min read</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onReadPost(post.id)}
                          className="text-left mt-1.5 group cursor-pointer"
                        >
                          <h3 className="font-serif text-xl font-semibold text-neutral-950 dark:text-white group-hover:underline underline-offset-4 decoration-1">
                            {post.title}
                          </h3>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 sm:gap-6 pl-11 sm:pl-0 shrink-0">
                      <div className="text-right">
                        <p className="font-mono text-sm tabular-nums text-neutral-900 dark:text-neutral-100">
                          {post.views.toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          reads
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-sm tabular-nums text-neutral-900 dark:text-neutral-100">
                          {score.toLocaleString()}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          score
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleApplause(post.id)}
                        aria-pressed={applauded}
                        aria-label={`Recommend ${post.title}`}
                        className={`h-9 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          applauded
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                            : 'border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-950 dark:hover:border-white'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${applauded ? 'fill-current' : ''}`}
                        />
                        <span className="font-mono tabular-nums">{post.applause}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
