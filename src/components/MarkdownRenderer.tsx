import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  dropCap?: boolean;
  className?: string;
}

export function MarkdownRenderer({
  content,
  dropCap = false,
  className = '',
}: MarkdownRendererProps) {
  return (
    <div
      className={`folio-prose ${dropCap ? 'folio-prose--dropcap' : ''} ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
