import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Pencil, Trash2 } from 'lucide-react';
import { Post, User } from '../types';
import { estimateReadingTime, formatEditorialDate } from '../utils/reading';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ArticleViewProps {
  post: Post;
  allPosts: Post[];
  user: User | null;
  hasApplauded: boolean;
  onToggleApplause: (postId: string) => void;
  onBack: () => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onReadPost: (postId: string) => void;
}

export function ArticleView({
  post,
  allPosts,
  user,
  hasApplauded,
  onToggleApplause,
  onBack,
  onEdit,
  onDelete,
  onReadPost,
}: ArticleViewProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isOwner = Boolean(
    user && user.email.toLowerCase() === post.authorEmail.toLowerCase()
  );

  useEffect(() => {
    setConfirmingDelete(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [post.id]);

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)));
      }
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relatedPosts = allPosts
    .filter((p) => p.status === 'published' && p.id !== post.id)
    .slice(0, 2);

  return (
    <article className="relative pb-20">
      {/* Subtle reading progress hairline */}
      <div
        className="fixed top-16 left-0 right-0 h-0.5 bg-neutral-100 dark:bg-neutral-900 z-30 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-neutral-950 dark:bg-white transition-transform duration-75 origin-left"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to stories</span>
        </button>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {post.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {post.status === 'draft'
              ? 'Draft preview'
              : formatEditorialDate(post.publishedAt || post.updatedAt)}
          </span>
          <span aria-hidden="true">·</span>
          <span>{estimateReadingTime(post.content)} min read</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{post.views.toLocaleString()} reads</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.12] text-neutral-950 dark:text-white mt-4 text-balance">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed mt-4">
            {post.subtitle}
          </p>
        )}

        <div className="mt-7 py-5 border-y border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-950 dark:text-white">
              {post.authorName}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {post.authorEmail}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {post.status === 'published' && (
              <button
                type="button"
                onClick={() => onToggleApplause(post.id)}
                aria-pressed={hasApplauded}
                className={`h-10 px-4 rounded-lg inline-flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer ${
                  hasApplauded
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    : 'border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-950 dark:hover:border-white'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${hasApplauded ? 'fill-current' : ''}`}
                />
                <span className="font-mono tabular-nums">{post.applause}</span>
                <span>{hasApplauded ? 'Recommended' : 'Recommend'}</span>
              </button>
            )}

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(post.id)}
                  className="h-10 px-4 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {!confirmingDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className="h-10 px-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-red-600 hover:text-red-700 dark:hover:border-red-500 dark:hover:text-red-400 inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDelete(post.id)}
                      className="h-10 px-3.5 rounded-lg bg-red-700 text-white hover:bg-red-800 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="h-10 px-3 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Optional Lead Figure */}
      {post.coverImage && (
        <figure className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
          <div className="rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[520px] object-cover"
            />
          </div>
          {post.coverCaption && (
            <figcaption className="text-xs font-serif italic text-neutral-500 dark:text-neutral-400 mt-2.5 text-center">
              {post.coverCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Main Markdown Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-10">
        <MarkdownRenderer content={post.content} dropCap />

        {/* Bottom Recommendation Footer */}
        {post.status === 'published' && (
          <div className="mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif text-lg font-semibold text-neutral-950 dark:text-white">
                Enjoyed this essay?
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                Recommendations help surface thoughtful writing on the Folio leaderboard.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleApplause(post.id)}
              aria-pressed={hasApplauded}
              className={`h-11 px-5 rounded-lg inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors shrink-0 cursor-pointer ${
                hasApplauded
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:border-neutral-950 dark:hover:border-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasApplauded ? 'fill-current' : ''}`} />
              <span>{hasApplauded ? 'Recommended' : 'Recommend essay'}</span>
              <span className="font-mono text-xs tabular-nums opacity-80">
                ({post.applause})
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Continue Reading */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-6">
            More from Folio
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onReadPost(item.id)}
                className="text-left group rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.authorName}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-neutral-950 dark:text-white mt-2 group-hover:underline underline-offset-4 decoration-1">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                  {item.subtitle}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
