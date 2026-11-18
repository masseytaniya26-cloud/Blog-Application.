import { Post, ThemeMode, User } from '../types';
import { SEED_POSTS } from '../data/seedPosts';

const STORAGE_KEYS = {
  USER: 'folio_user_v1',
  POSTS: 'folio_posts_v1',
  APPLAUDED: 'folio_applauded_v1',
  THEME: 'folio_theme_v1',
} as const;

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (parsed && typeof parsed.name === 'string' && typeof parsed.email === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
      return SEED_POSTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as Post[];
    }
    return SEED_POSTS;
  } catch {
    return SEED_POSTS;
  }
}

export function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadApplaudedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLAUDED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function saveApplaudedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPLAUDED, JSON.stringify(ids));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // Fallback to light
  }
  return 'light';
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // Ignore storage quota errors
  }
}
