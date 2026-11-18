import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Post, User } from '../types';
import { estimateReadingTime, formatEditorialDate } from '../utils/reading';

interface MyStoriesPageProps {
  user: User | null;
  posts: Post[];
  onOpenSignIn: () => void;
  onWriteNew: () => void;
  onReadPost: (postId: string) => void;
  onEditPost: (postId: string) => void;
  onTogglePublish: (postId: string) => void;
  onDeletePost: (postId: string) => void;
}

type StoryTab = 'all' | 'published' | 'draft';

export function MyStoriesPage({
  user,
  posts,
  onOpenSignIn,
  onWriteNew,
  onReadPost,
  onEditPost,
  onTogglePublish,
  onDeletePost,
}: MyStoriesPageProps) {
  const [tab, setTab] = useState<StoryTab>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const ownPosts = useMemo(() => {
    if (!user) return [];
    const email = user.email.toLowerCase();
    return [...posts]
      .filter((p) => p.authorEmail.toLowerCase() === email)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [posts, user]);

  const publishedCount = ownPosts.filter((p) => p.status === 'published').length;
  const draftCount = ownPosts.filter((p) => p.status === 'draft').length;

  const visiblePosts = ownPosts.filter((p) => {
    if (tab === 'all') return true;
    return p.status === tab;
  });

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 text-center bg-white dark:bg-neutral-950">
          <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            Personal Library
          </p>
          <h1 className="font-serif text-3xl font-semibold text-neutral-950 dark:text-white mt-2">
            Sign in to view your stories
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 max-w-md mx-auto leading-relaxed">
            Your saved drafts and published essays are tied to your local name and email byline.
          </p>
          <button
            type="button"
            onClick={onOpenSignIn}
            className="mt-6 h-11 px-6 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            {user.name} · {user.email}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 dark:text-white mt-1">
            My Stories
          </h1>
        </div>

        <button
          type="button"
          onClick={onWriteNew}
          className="h-10 px-5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
        >
          Write a story
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter your stories"
        className="mt-6 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4"
      >
        {(
          [
            { id: 'all', label: `All (${ownPosts.length})` },
            { id: 'published', label: `Published (${publishedCount})` },
            { id: 'draft', label: `Drafts (${draftCount})` },
          ] as const
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Stories List */}
      {visiblePosts.length === 0 ? (
        <div className="mt-10 py-14 text-center rounded-xl border border-neutral-200 dark:border-neutral-800">
          <h2 className="font-serif text-2xl font-semibold text-neutral-950 dark:text-white">
            {tab === 'draft'
              ? 'No saved drafts'
              : tab === 'published'
              ? 'No published stories yet'
              : 'Your writing desk is clear'}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
            Compose a Markdown essay and save it as a draft or publish it to Folio readers.
          </p>
          <button
            type="button"
            onClick={onWriteNew}
            className="mt-6 h-10 px-5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors cursor-pointer"
          >
            Start writing
          </button>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {visiblePosts.map((post) => (
            <article
              key={post.id}
              className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span
                    className={`font-medium ${
                      post.status === 'published'
                        ? 'text-neutral-950 dark:text-white'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Updated {formatEditorialDate(post.updatedAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{estimateReadingTime(post.content)} min read</span>
                  {post.status === 'published' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {post.views} reads · {post.applause} recommends
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onReadPost(post.id)}
                  className="text-left mt-2 group cursor-pointer block"
                >
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-950 dark:text-white group-hover:underline underline-offset-4 decoration-1">
                    {post.title}
                  </h2>
                </button>

                {post.subtitle && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2">
                    {post.subtitle}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onReadPost(post.id)}
                  className="h-9 px-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:border-neutral-950 dark:hover:border-white transition-colors cursor-pointer"
                >
                  {post.status === 'draft' ? 'Preview' : 'Read'}
                </button>

                <button
                  type="button"
                  onClick={() => onTogglePublish(post.id)}
                  className="h-9 px-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:border-neutral-950 dark:hover:border-white transition-colors cursor-pointer"
                >
                  {post.status === 'published' ? 'Move to drafts' : 'Publish'}
                </button>

                <button
                  type="button"
                  onClick={() => onEditPost(post.id)}
                  className="h-9 px-3.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {confirmDeleteId !== post.id ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(post.id)}
                    aria-label={`Delete ${post.title}`}
                    className="h-9 px-3 rounded-lg text-neutral-500 hover:text-red-700 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 inline-flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(null);
                        onDeletePost(post.id);
                      }}
                      className="h-9 px-3 rounded-lg bg-red-700 text-white hover:bg-red-800 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="h-9 px-2.5 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
