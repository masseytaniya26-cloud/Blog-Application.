export type PostStatus = 'draft' | 'published';

export type PageView = 'home' | 'read' | 'write' | 'my-stories' | 'leaderboard';

export type ThemeMode = 'light' | 'dark';

export interface User {
  name: string;
  email: string;
  signedInAt: string;
}

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  coverImage?: string;
  coverCaption?: string;
  authorName: string;
  authorEmail: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  applause: number;
}

export interface EditorialCoverOption {
  id: string;
  label: string;
  url: string;
  defaultCaption: string;
}

export const CATEGORIES = [
  'Essays',
  'Architecture',
  'Craft',
  'Culture',
  'Notes',
] as const;

export const EDITORIAL_COVER_OPTIONS: EditorialCoverOption[] = [
  {
    id: 'desk',
    label: 'Morning Desk',
    url: '/src/assets/images/hero_editorial_desk_1795001124075.jpg',
    defaultCaption: 'Fig. 1 — Morning light across the reading table.',
  },
  {
    id: 'architecture',
    label: 'Concrete Gallery',
    url: '/src/assets/images/story_architecture_light_1795001124453.jpg',
    defaultCaption: 'Fig. 2 — Diagonal afternoon light in the east hall.',
  },
  {
    id: 'typewriter',
    label: 'Analog Typewriter',
    url: '/src/assets/images/story_analog_craft_1795001125448.jpg',
    defaultCaption: 'Fig. 3 — Mechanical keys and cotton rag folio sheets.',
  },
  {
    id: 'botanical',
    label: 'Botanical Archive',
    url: '/src/assets/images/story_botanical_archive_1795001125852.jpg',
    defaultCaption: 'Fig. 4 — Mounted herbarium specimens and margin notes.',
  },
];
