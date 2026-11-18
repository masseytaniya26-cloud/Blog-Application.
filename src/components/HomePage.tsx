import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { CATEGORIES, PageView, Post, User } from '../types';
import { estimateReadingTime, formatEditorialDate } from '../utils/reading';
import { CoverImage } from './CoverImage';

interface HomePageProps {
  posts: Post[];
  user: User | null;
  onReadPost: (postId: string) => void;
  onEditPost: (postId: string) => void;
  onNavigate: (view: PageView) => void;
}

export function HomePage({
  posts,
  user,
  onReadPost,
  onEditPost,
  onNavigate,
}: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const publishedPosts = useMemo(() => {
    return [...posts]
      .filter((p) => p.status === 'published')
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.updatedAt).getTime();
        const dateB = new Date(b.publishedAt || b.updatedAt).getTime();
        return dateB - dateA;
      });
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publishedPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.subtitle.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [publishedPosts, selectedCategory, searchQuery]);

  const heroFeaturePost = publishedPosts[0];
  const isDefaultFeed = selectedCategory === 'All' && searchQuery.trim() === '';
  const leadPost = isDefaultFeed ? filteredPosts[0] : null;
  const archivePosts = isDefaultFeed ? filteredPosts.slice(1) : filteredPosts;

  const topWriters = useMemo(() => {
    const map = new Map<
      string,
      { name: string; email: string; stories: number; views: number; applause: number }
    >();
    for (const post of publishedPosts) {
      const key = post.authorEmail.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.stories += 1;
        existing.views += post.views;
        existing.applause += post.applause;
      } else {
        map.set(key, {
          name: post.authorName,
          email: post.authorEmail,
          stories: 1,
          views: post.views,
          applause: post.applause,
        });
      }
    }
    return [...map.values()]
      .sort((a, b) => b.views + b.applause * 5 - (a.views + a.applause * 5))
      .slice(0, 4);
  }, [publishedPosts]);

  const isOwnPost = (post: Post) =>
    Boolean(user && user.email.toLowerCase() === post.authorEmail.toLowerCase());

  return (
    <main>
      {/* Editorial Hero Section */}
      <section className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                  Independent Editorial Journal
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight leading-[1.08] text-neutral-950 dark:text-white mt-4 text-balance">
                  Thoughtful essays, written in quiet rooms.
                </h1>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mt-5 max-w-xl">
                  Folio is a distraction-free space for long-form Markdown writing,
                  deliberate reading, and independent voices worth returning to.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('write')}
                  className="h-11 px-6 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Write a story
                </button>
                {heroFeaturePost && (
                  <button
                    type="button"
                    onClick={() => onReadPost(heroFeaturePost.id)}
                    className="h-11 px-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer group"
                  >
                    <span>Read latest issue</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              {heroFeaturePost ? (
                <button
                  type="button"
                  onClick={() => onReadPost(heroFeaturePost.id)}
                  className="group relative block w-full h-full min-h-[300px] lg:min-h-[380px] rounded-xl overflow-hidden text-left border border-neutral-200 dark:border-neutral-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white"
                >
                  <img
                    src={
                      heroFeaturePost.coverImage ||
                      '/src/assets/images/hero_editorial_desk_1795001124075.jpg'
                    }
                    alt={heroFeaturePost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover lg:absolute lg:inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-200">
                      <span>Featured</span>
                      <span aria-hidden="true">·</span>
                      <span>{heroFeaturePost.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{heroFeaturePost.authorName}</span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-semibold leading-snug mt-2 text-balance">
                      {heroFeaturePost.title}
                    </h2>
                  </div>
                </button>
              ) : (
                <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  <img
                    src="/src/assets/images/hero_editorial_desk_1795001124075.jpg"
                    alt="Minimalist editorial reading table"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div
            role="tablist"
            aria-label="Filter stories by category"
            className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0"
          >
            {['All', ...CATEGORIES].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays or authors"
              aria-label="Search published stories"
              className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-950 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-950 dark:focus:border-white transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Published Stories Feed */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
            <h2 className="font-serif text-2xl font-semibold text-neutral-950 dark:text-white">
              No matching essays yet
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
              {publishedPosts.length === 0
                ? 'Be the first to publish an essay on Folio.'
                : 'Try clearing your search or selecting another category.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {publishedPosts.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="h-10 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('write')}
                className="h-10 px-5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors cursor-pointer"
              >
                Write an essay
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Tier 1: Lead Story */}
            {leadPost && (
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-neutral-200 dark:border-neutral-800">
                <div className="lg:col-span-7">
                  <button
                    type="button"
                    onClick={() => onReadPost(leadPost.id)}
                    className="block w-full rounded-xl overflow-hidden cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white"
                  >
                    <CoverImage
                      src={leadPost.coverImage}
                      alt={leadPost.title}
                      title={leadPost.title}
                      aspectClassName="aspect-[16/10]"
                      className="rounded-xl group-hover:opacity-95 transition-opacity"
                    />
                  </button>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {leadPost.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formatEditorialDate(leadPost.publishedAt || leadPost.updatedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{estimateReadingTime(leadPost.content)} min read</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onReadPost(leadPost.id)}
                    className="text-left mt-3 group cursor-pointer"
                  >
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold leading-snug text-neutral-950 dark:text-white group-hover:underline underline-offset-4 decoration-1 text-balance">
                      {leadPost.title}
                    </h2>
                  </button>

                  <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed mt-3">
                    {leadPost.subtitle}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="text-sm text-neutral-700 dark:text-neutral-300">
                      <span>By {leadPost.authorName}</span>
                      <span className="mx-2 text-neutral-400" aria-hidden="true">·</span>
                      <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                        {leadPost.views.toLocaleString()} reads
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isOwnPost(leadPost) && (
                        <button
                          type="button"
                          onClick={() => onEditPost(leadPost.id)}
                          className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline underline-offset-4 cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onReadPost(leadPost.id)}
                        className="h-10 px-4 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Read essay
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Tier 2: Secondary Grid */}
            {archivePosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {archivePosts.map((post) => (
                  <article
                    key={post.id}
                    className="flex flex-col justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 md:border-b-0 md:pb-0"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => onReadPost(post.id)}
                        className="block w-full rounded-xl overflow-hidden cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:focus-visible:outline-white"
                      >
                        <CoverImage
                          src={post.coverImage}
                          alt={post.title}
                          title={post.title}
                          aspectClassName="aspect-[4/3]"
                          className="rounded-xl"
                        />
                      </button>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {post.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatEditorialDate(post.publishedAt || post.updatedAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{estimateReadingTime(post.content)} min read</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onReadPost(post.id)}
                        className="text-left mt-2.5 group cursor-pointer"
                      >
                        <h3 className="font-serif text-xl font-semibold leading-snug text-neutral-950 dark:text-white group-hover:underline underline-offset-4 decoration-1">
                          {post.title}
                        </h3>
                      </button>

                      {post.subtitle && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2 line-clamp-3">
                          {post.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <div className="truncate pr-2">
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          {post.authorName}
                        </span>
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {post.applause} recommends
                        </span>
                      </div>

                      {isOwnPost(post) && (
                        <button
                          type="button"
                          onClick={() => onEditPost(post.id)}
                          className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline underline-offset-4 shrink-0 cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Leaderboard Preview Band */}
      {topWriters.length > 0 && (
        <section className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/35">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                  Reader Standings
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-950 dark:text-white mt-1">
                  Top Contributors on Folio
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('leaderboard')}
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-950 dark:text-white hover:underline underline-offset-4 cursor-pointer self-start sm:self-auto"
              >
                <span>Open full leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {topWriters.map((writer, idx) => (
                <div
                  key={writer.email}
                  className="rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-5"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                      {writer.stories} {writer.stories === 1 ? 'essay' : 'essays'}
                    </span>
                  </div>
                  <p className="font-serif text-lg font-semibold text-neutral-950 dark:text-white mt-3 truncate">
                    {writer.name}
                  </p>
                  <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
                    <span>{writer.views.toLocaleString()} reads</span>
                    <span>{writer.applause} rec.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
