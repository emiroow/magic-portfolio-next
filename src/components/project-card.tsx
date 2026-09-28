import { iconDecider } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';

interface ProjectCardProps {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  links?: readonly { icon: string; type: string; href: string }[];
  className?: string;
}

/**
 * Portfolio project card. The title carries a stretched link so the whole
 * surface is clickable, while the resource chips stay independently
 * focusable above it. Cover images render in grayscale to protect the
 * monochrome palette and regain colour on hover.
 */
export function ProjectCard({ title, href, description, dates, tags, image, links, className }: ProjectCardProps) {
  const isExternal = Boolean(href && /^https?:\/\//i.test(href));

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden p-0 transition-colors hover:border-foreground/30',
        className
      )}
    >
      {image ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-top grayscale transition-[filter] duration-500 group-hover:grayscale-0"
          />
        </div>
      ) : (
        // Deterministic monogram keeps the grid aligned without an image.
        <div className="flex aspect-[16/9] w-full items-center justify-center border-b bg-muted/40">
          <span aria-hidden className="text-3xl font-bold text-muted-foreground/40">
            {title.slice(0, 1).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex grow flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="min-w-0 text-sm font-semibold leading-snug sm:text-base">
            {href ? (
              <Link
                href={href}
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="transition-colors after:absolute after:inset-0 after:content-[''] hover:underline"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          {Boolean(dates) && <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{dates}</span>}
        </div>

        <Markdown className="prose prose-neutral mt-2 max-w-full text-pretty text-xs leading-relaxed text-muted-foreground dark:prose-invert prose-p:my-0 sm:text-[13px]">
          {description}
        </Markdown>

        {tags && tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {tags.map(tag => (
              <li key={tag}>
                <Badge variant="secondary" className="px-2 py-0 text-[10px] font-normal">
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        {links && links.length > 0 && (
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-1.5 border-t pt-3">
            {links.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                {iconDecider(link.icon, 'size-3')}
                {link.type}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
