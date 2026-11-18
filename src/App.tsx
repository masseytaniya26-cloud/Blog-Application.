import { useEffect, useMemo, useRef, useState } from 'react';
import { PageView, Post, PostStatus, ThemeMode, User } from './types';
import {
  loadApplaudedIds,
  loadPosts,
  loadTheme,
  loadUser,
  saveApplaudedIds,
  savePosts,
  saveTheme,
  saveUser,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ArticleView } from './components/ArticleView';
import { WritePage } from './components/WritePage';
import { MyStoriesPage } from './components/MyStoriesPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { SignInModal } from './components/SignInModal';
import { Footer } from './components/Footer';

export default function App() {
  const [user, setUser] = useState<User | null>(() => loadUser());
  const [posts, setPosts] = useState<Post[]>(() => loadPosts());
  const [applaudedIds, setApplaudedIds] = useState<string[]>(() =>
    loadApplaudedIds()
  );
  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme());

  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const [signInOpen, setSignInOpen] = useState(false);
  const [signInContext, setSignInContext] = useState<string | undefined>(
    undefined
  );
  const pendingActionRef = useRef<((signedInUser: User) => void) | null>(null);

  // Sync theme class on <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Persist posts whenever changed
  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  // Persist applauded IDs whenever changed
  useEffect(() => {
    saveApplaudedIds(applaudedIds);
  }, [applaudedIds]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (view: PageView) => {
    if (view === 'write') {
      setEditingPostId(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleReadPost = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;

    if (target.status === 'published') {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, views: p.views + 1 } : p))
      );
    }

    setActivePostId(postId);
    setCurrentView('read');
  };

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    setCurrentView('write');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (activePostId === postId) {
      setActivePostId(null);
      setCurrentView('home');
    }
    if (editingPostId === postId) {
      setEditingPostId(null);
    }
  };

  const handleTogglePublish = (postId: string) => {
    const now = new Date().toISOString();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextStatus: PostStatus =
          p.status === 'published' ? 'draft' : 'published';
        return {
          ...p,
          status: nextStatus,
          updatedAt: now,
          publishedAt:
            nextStatus === 'published' ? p.publishedAt || now : p.publishedAt,
        };
      })
    );
  };

  const handleToggleApplause = (postId: string) => {
    const alreadyApplauded = applaudedIds.includes(postId);
    setApplaudedIds((prev) =>
      alreadyApplauded ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          applause: Math.max(0, p.applause + (alreadyApplauded ? -1 : 1)),
        };
      })
    );
  };

  const handleSavePost = (
    data: {
      id?: string;
      title: string;
      subtitle: string;
      content: string;
      category: string;
      coverImage?: string;
      coverCaption?: string;
      status: PostStatus;
    },
    navigateAfter: 'read' | 'my-stories' | 'stay' = 'my-stories',
    authorOverride?: User
  ) => {
    const activeAuthor = authorOverride || user;
    if (!activeAuthor) return;

    const now = new Date().toISOString();
    let savedId = data.id;

    if (data.id) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== data.id) return p;
          return {
            ...p,
            title: data.title,
            subtitle: data.subtitle,
            content: data.content,
            category: data.category,
            coverImage: data.coverImage,
            coverCaption: data.coverCaption,
            status: data.status,
            updatedAt: now,
            publishedAt:
              data.status === 'published'
                ? p.publishedAt || now
                : p.publishedAt,
          };
        })
      );
    } else {
      savedId = `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newPost: Post = {
        id: savedId,
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        category: data.category,
        coverImage: data.coverImage,
        coverCaption: data.coverCaption,
        authorName: activeAuthor.name,
        authorEmail: activeAuthor.email,
        status: data.status,
        createdAt: now,
        updatedAt: now,
        publishedAt: data.status === 'published' ? now : undefined,
        views: data.status === 'published' ? 1 : 0,
        applause: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    }

    setEditingPostId(null);

    if (navigateAfter === 'read' && savedId) {
      setActivePostId(savedId);
      setCurrentView('read');
    } else if (navigateAfter === 'my-stories') {
      setCurrentView('my-stories');
    }
  };

  const handleOpenSignIn = (
    pendingAction?: (signedInUser: User) => void,
    message?: string
  ) => {
    pendingActionRef.current = pendingAction || null;
    setSignInContext(message);
    setSignInOpen(true);
  };

  const handleSignIn = (newUser: User) => {
    setUser(newUser);
    saveUser(newUser);
    setSignInOpen(false);
    setSignInContext(undefined);

    const pending = pendingActionRef.current;
    pendingActionRef.current = null;
    if (pending) {
      pending(newUser);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    saveUser(null);
    if (currentView === 'my-stories') {
      setCurrentView('home');
    }
  };

  const activePost = useMemo(
    () => posts.find((p) => p.id === activePostId) || null,
    [posts, activePostId]
  );

  const editingPost = useMemo(() => {
    if (!editingPostId) return null;
    const found = posts.find((p) => p.id === editingPostId) || null;
    if (!found || !user) return null;
    if (found.authorEmail.toLowerCase() !== user.email.toLowerCase()) return null;
    return found;
  }, [posts, editingPostId, user]);

  const draftCount = useMemo(() => {
    if (!user) return 0;
    const email = user.email.toLowerCase();
    return posts.filter(
      (p) => p.status === 'draft' && p.authorEmail.toLowerCase() === email
    ).length;
  }, [posts, user]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-150">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onOpenSignIn={() => handleOpenSignIn()}
        onSignOut={handleSignOut}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        draftCount={draftCount}
      />

      <div className="flex-1">
        {currentView === 'home' && (
          <HomePage
            posts={posts}
            user={user}
            onReadPost={handleReadPost}
            onEditPost={handleEditPost}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'read' && activePost && (
          <ArticleView
            post={activePost}
            allPosts={posts}
            user={user}
            hasApplauded={applaudedIds.includes(activePost.id)}
            onToggleApplause={handleToggleApplause}
            onBack={() => handleNavigate('home')}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onReadPost={handleReadPost}
          />
        )}

        {currentView === 'read' && !activePost && (
          <main className="max-w-3xl mx-auto px-4 py-20 text-center">
            <h1 className="font-serif text-3xl font-semibold">Story not found</h1>
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="mt-6 h-10 px-5 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-sm font-medium cursor-pointer"
            >
              Return home
            </button>
          </main>
        )}

        {currentView === 'write' && (
          <WritePage
            user={user}
            editingPost={editingPost}
            onSavePost={handleSavePost}
            onRequestSignIn={(pending) =>
              handleOpenSignIn(
                pending,
                'Sign in with your name and email to save your draft or publish your story under your byline.'
              )
            }
            onCancelEdit={() => {
              setEditingPostId(null);
              handleNavigate('my-stories');
            }}
          />
        )}

        {currentView === 'my-stories' && (
          <MyStoriesPage
            user={user}
            posts={posts}
            onOpenSignIn={() => handleOpenSignIn()}
            onWriteNew={() => handleNavigate('write')}
            onReadPost={handleReadPost}
            onEditPost={handleEditPost}
            onTogglePublish={handleTogglePublish}
            onDeletePost={handleDeletePost}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardPage
            posts={posts}
            user={user}
            applaudedIds={applaudedIds}
            onReadPost={handleReadPost}
            onToggleApplause={handleToggleApplause}
            onWriteNew={() => handleNavigate('write')}
          />
        )}
      </div>

      <Footer onNavigate={handleNavigate} />

      <SignInModal
        isOpen={signInOpen}
        onClose={() => {
          pendingActionRef.current = null;
          setSignInOpen(false);
          setSignInContext(undefined);
        }}
        onSignIn={handleSignIn}
        contextMessage={signInContext}
      />
    </div>
  );
}
