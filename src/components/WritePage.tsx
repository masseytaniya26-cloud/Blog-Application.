import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  Quote,
} from 'lucide-react';
import {
  CATEGORIES,
  EDITORIAL_COVER_OPTIONS,
  Post,
  PostStatus,
  User,
} from '../types';
import { countWords, estimateReadingTime } from '../utils/reading';
import { MarkdownRenderer } from './MarkdownRenderer';

interface WritePageProps {
  user: User | null;
  editingPost: Post | null;
  onSavePost: (
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
    navigateAfter?: 'read' | 'my-stories' | 'stay',
    authorOverride?: User
  ) => void;
  onRequestSignIn: (pendingAction: (signedInUser: User) => void) => void;
  onCancelEdit: () => void;
}

type EditorMode = 'write' | 'split' | 'preview';

export function WritePage({
  user,
  editingPost,
  onSavePost,
  onRequestSignIn,
  onCancelEdit,
}: WritePageProps) {
  const [title, setTitle] = useState(editingPost?.title || '');
  const [subtitle, setSubtitle] = useState(editingPost?.subtitle || '');
  const [category, setCategory] = useState<string>(
    editingPost?.category || CATEGORIES[0]
  );
  const [coverImage, setCoverImage] = useState<string>(
    editingPost?.coverImage || ''
  );
  const [coverCaption, setCoverCaption] = useState<string>(
    editingPost?.coverCaption || ''
  );
  const [content, setContent] = useState(editingPost?.content || '');
  const [mode, setMode] = useState<EditorMode>('split');
  const [error, setError] = useState('');
  const [statusNotice, setStatusNotice] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(editingPost?.title || '');
    setSubtitle(editingPost?.subtitle || '');
    setCategory(editingPost?.category || CATEGORIES[0]);
    setCoverImage(editingPost?.coverImage || '');
    setCoverCaption(editingPost?.coverCaption || '');
    setContent(editingPost?.content || '');
    setError('');
    setStatusNotice('');
  }, [editingPost]);

  const insertSyntax = (prefix: string, suffix = '', placeholder = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const nextContent =
      content.slice(0, start) + prefix + selected + suffix + content.slice(end);
    setContent(nextContent);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + selected.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const handleSubmit = (status: PostStatus) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError('Please add a headline before saving or publishing.');
      return;
    }

    if (status === 'published' && trimmedContent.length < 20) {
      setError('Published essays need at least a few sentences of body prose.');
      return;
    }

    setError('');

    const executeSave = (activeUser: User) => {
      onSavePost(
        {
          id: editingPost?.id,
          title: trimmedTitle,
          subtitle: subtitle.trim(),
          content: content,
          category,
          coverImage: coverImage.trim() || undefined,
          coverCaption: coverCaption.trim() || undefined,
          status,
        },
        status === 'published' ? 'read' : 'my-stories',
        activeUser
      );
      if (status === 'draft') {
        setStatusNotice('Saved to your drafts.');
      }
    };

    if (!user) {
      onRequestSignIn(executeSave);
      return;
    }

    executeSave(user);
  };

  const words = countWords(content);
  const readMinutes = estimateReadingTime(content);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Composer Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <p className="text-xs tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            {editingPost ? 'Editing Story' : 'New Draft'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-950 dark:text-white mt-1">
            {editingPost ? 'Revise your essay' : 'Compose in Markdown'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Segmented Control */}
          <div
            role="tablist"
            aria-label="Editor view mode"
            className="inline-flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
          >
            {(['write', 'split', 'preview'] as EditorMode[]).map((tab) => {
              const label =
                tab === 'write' ? 'Write' : tab === 'split' ? 'Split' : 'Preview';
              const active = mode === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setMode(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    tab === 'split' ? 'hidden lg:inline-flex' : 'inline-flex'
                  } ${
                    active
                      ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {editingPost && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="h-10 px-4 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="h-10 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-950 dark:hover:border-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Save as draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            className="h-10 px-5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {editingPost?.status === 'published' ? 'Update story' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Author notice if signed out */}
      {!user && (
        <div className="mt-5 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            You can draft freely right now. Sign in with your name and email when you are ready to save or publish.
          </p>
          <button
            type="button"
            onClick={() => onRequestSignIn(() => {})}
            className="text-sm font-medium text-neutral-950 dark:text-white underline underline-offset-4 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Sign in now
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-5 px-4 py-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 text-sm text-red-800 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {statusNotice && (
        <div
          role="status"
          className="mt-5 px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-800 dark:text-neutral-200"
        >
          {statusNotice}
        </div>
      )}

      {/* Story Metadata Controls */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div className="lg:col-span-8 space-y-4">
          <div>
            <label htmlFor="post-title" className="sr-only">
              Essay Title
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Essay title..."
              className="w-full font-serif text-3xl sm:text-4xl font-semibold text-neutral-950 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700 bg-transparent focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="post-subtitle" className="sr-only">
              Subtitle or deck
            </label>
            <input
              id="post-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Add a concise subtitle or deck for readers..."
              className="w-full text-base sm:text-lg text-neutral-600 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="post-category"
                className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1"
              >
                Category
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-950 dark:focus:border-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="post-cover-preset"
                className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1"
              >
                Editorial Cover
              </label>
              <select
                id="post-cover-preset"
                value={
                  EDITORIAL_COVER_OPTIONS.some((opt) => opt.url === coverImage)
                    ? coverImage
                    : coverImage
                    ? 'custom'
                    : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setCoverImage('');
                    setCoverCaption('');
                  } else if (val !== 'custom') {
                    setCoverImage(val);
                    const found = EDITORIAL_COVER_OPTIONS.find(
                      (o) => o.url === val
                    );
                    if (found && !coverCaption) {
                      setCoverCaption(found.defaultCaption);
                    }
                  }
                }}
                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-950 dark:focus:border-white"
              >
                <option value="">No cover photo</option>
                {EDITORIAL_COVER_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.url}>
                    {opt.label}
                  </option>
                ))}
                {coverImage &&
                  !EDITORIAL_COVER_OPTIONS.some((o) => o.url === coverImage) && (
                    <option value="custom">Custom URL</option>
                  )}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="post-cover-url"
              className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1"
            >
              Cover image path or URL (optional)
            </label>
            <input
              id="post-cover-url"
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Choose a preset above or paste an image URL"
              className="w-full h-10 px-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-950 dark:focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* Editor & Live Markdown Preview Workspace */}
      <div
        className={`mt-6 grid gap-8 ${
          mode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Markdown Composer Pane */}
        {(mode === 'write' || mode === 'split') && (
          <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-950">
            <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  title="Heading 2"
                  aria-label="Insert Heading 2"
                  onClick={() => insertSyntax('## ', '', 'Section Heading')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Heading 3"
                  aria-label="Insert Heading 3"
                  onClick={() => insertSyntax('### ', '', 'Subsection')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Bold"
                  aria-label="Bold"
                  onClick={() => insertSyntax('**', '**', 'bold text')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  aria-label="Italic"
                  onClick={() => insertSyntax('*', '*', 'italic text')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Blockquote"
                  aria-label="Insert Quote"
                  onClick={() => insertSyntax('> ', '', 'Pull quote or reflection...')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Bulleted list"
                  aria-label="Insert List"
                  onClick={() => insertSyntax('- ', '', 'List item')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Inline code"
                  aria-label="Insert Code"
                  onClick={() => insertSyntax('`', '`', 'code')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Link"
                  aria-label="Insert Link"
                  onClick={() => insertSyntax('[', '](https://example.com)', 'link label')}
                  className="w-8 h-8 inline-flex items-center justify-center rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                {words} words · {readMinutes} min read
              </span>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your essay in Markdown...\n\nUse ## for section headings, > for pull quotes, **bold**, and *italics*.`}
              aria-label="Markdown essay editor"
              className="w-full min-h-[480px] p-5 bg-transparent font-mono text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none resize-y"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(mode === 'preview' || mode === 'split') && (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 bg-white dark:bg-neutral-950 min-h-[520px]">
            <div className="pb-4 mb-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Live Reader Preview</span>
              <span>
                {category} · {readMinutes} min read
              </span>
            </div>

            {coverImage && (
              <div className="mb-6 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                <img
                  src={coverImage}
                  alt={title || 'Cover preview'}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-64 object-cover"
                />
              </div>
            )}

            <h2 className="font-serif text-3xl font-semibold text-neutral-950 dark:text-white leading-tight">
              {title.trim() || 'Untitled Essay'}
            </h2>

            {subtitle.trim() && (
              <p className="text-base text-neutral-600 dark:text-neutral-300 mt-2.5 leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              {content.trim() ? (
                <MarkdownRenderer content={content} dropCap />
              ) : (
                <p className="text-sm italic text-neutral-400 dark:text-neutral-600">
                  Start composing Markdown on the left to preview your typography, headings, quotes, and tables here.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
