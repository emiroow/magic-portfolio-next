import { cn } from '@/lib/utils';
import type { CSSProperties, ReactNode } from 'react';

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Entrance duration in seconds. */
  duration?: number;
  /** Initial vertical offset in pixels. */
  yOffset?: number;
  /** Tie the entrance to the element scrolling into view. */
  inView?: boolean;
}

/**
 * Entrance animation for a block. Purely declarative: opacity/transform only
 * (composited, no blur filter) driven by CSS, so the public bundle ships no
 * animation runtime and the LCP text is never blocked by hydration.
 */
export default function BlurFade({ children, className, delay = 0, duration = 0.5, yOffset = 8, inView = false }: BlurFadeProps) {
  return (
    <div
      className={cn('reveal', inView && 'reveal-view', className)}
      style={
        {
          '--reveal-delay': `${delay}s`,
          '--reveal-duration': `${duration}s`,
          '--reveal-y': `${yOffset}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
