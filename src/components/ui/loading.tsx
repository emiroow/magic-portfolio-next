import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/** Inline spinner for buttons and panels. */
const Loading = ({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) => (
  <div className={cn('flex items-center justify-center', className)} role="status" aria-label="Loading">
    <Loader2
      className={cn('animate-spin text-muted-foreground', {
        'h-4 w-4': size === 'sm',
        'h-6 w-6': size === 'md',
        'h-8 w-8': size === 'lg',
      })}
    />
    <span className="sr-only">Loading...</span>
  </div>
);

export default Loading;
