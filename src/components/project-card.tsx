import { iconDecider } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

/** Card for a single portfolio project on the home page. */
export function ProjectCard({ title, href, description, dates, tags, image, links, className }: ProjectCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0 transition-all duration-300 ease-out hover:shadow-lg">
      <Link href={href || '#'} className={cn('block cursor-pointer', className)} aria-label={title}>
        {image ? (
          <Image
            src={image}
            alt={title}
            width={600}
            height={314}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="h-40 w-full overflow-hidden object-cover object-top"
          />
        ) : (
          // Deterministic placeholder keeps the grid aligned without an image.
          <div className="flex h-40 w-full items-center justify-center bg-muted">
            <span className="text-2xl font-bold text-muted-foreground/50">{title.slice(0, 1).toUpperCase()}</span>
          </div>
        )}
      </Link>
      <CardHeader className="gap-1 px-4 pb-2 pt-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {Boolean(dates) && (
          <time className="text-xs text-muted-foreground">{dates}</time>
        )}
        <Markdown className="prose mt-1 max-w-full text-pretty text-xs text-muted-foreground dark:prose-invert prose-p:leading-relaxed">
          {description}
        </Markdown>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-4">
        {tags && tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.map(tag => (
              <Badge className="px-1.5 py-0 text-[10px]" variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {links && links.length > 0 && (
        <CardFooter className="border-t px-4 py-3">
          <div className="flex flex-row flex-wrap items-center gap-2">
            {links.map((link, idx) => (
              <Link key={idx} href={link.href} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="flex gap-2 px-2 py-1 text-[10px]">
                  {iconDecider(link.icon, 'h-3 w-3')}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
