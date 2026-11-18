import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface CoverImageProps {
  src?: string;
  alt: string;
  title?: string;
  className?: string;
  aspectClassName?: string;
}

export function CoverImage({
  src,
  alt,
  title,
  className = '',
  aspectClassName = 'aspect-[4/3]',
}: CoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center p-6 text-center ${aspectClassName} ${className}`}
        aria-label={alt}
      >
        <BookOpen className="w-6 h-6 text-neutral-400 dark:text-neutral-600 mb-3" strokeWidth={1.5} />
        {title ? (
          <p className="font-serif text-sm italic text-neutral-500 dark:text-neutral-400 line-clamp-2 max-w-[22ch]">
            {title}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${aspectClassName} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-500 ease-out"
      />
    </div>
  );
}
