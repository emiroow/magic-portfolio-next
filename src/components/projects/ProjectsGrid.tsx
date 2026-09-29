'use client';

import BlurFade from '@/components/magicui/blur-fade';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { localizedCount, projectKey } from '@/lib/utils';
import type { AppLocale, IProject } from '@/types';
import { Search, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

/** Projects rendered before the “load more” control appears. */
const PAGE_SIZE = 8;

interface ProjectsGridProps {
  projects: IProject[];
  technologies: string[];
}

/**
 * Project archive: instant search plus a technology filter, on the same
 * card grid as the home page section.
 */
export default function ProjectsGrid({ projects, technologies }: ProjectsGridProps) {
  const t = useTranslations('projectsPage');
  const locale = useLocale();
  const lang: AppLocale = locale === 'fa' ? 'fa' : 'en';

  const [query, setQuery] = useState('');
  const [tech, setTech] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter(project => {
      if (tech && !project.technologies.some(item => item.toLowerCase() === tech.toLowerCase())) return false;
      if (!needle) return true;
      return (
        (project.title || '').toLowerCase().includes(needle) ||
        (project.description || '').toLowerCase().includes(needle) ||
        project.technologies.some(item => item.toLowerCase().includes(needle))
      );
    });
  }, [projects, query, tech]);

  const shown = filtered.slice(0, visible);

  if (!projects.length) {
    return <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">{t('empty')}</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="ps-9 pe-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('clearSearch')}
              className="absolute end-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>

        <p className="text-xs tabular-nums text-muted-foreground sm:ms-auto">{t('count', { count: localizedCount(filtered.length, lang) })}</p>
      </div>

      {technologies.length > 0 && (
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:mx-0 sm:px-0">
          {technologies.map(item => {
            const active = tech === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setTech(active ? null : item);
                  setVisible(PAGE_SIZE);
                }}
                aria-pressed={active}
                className={
                  active
                    ? 'inline-flex shrink-0 items-center rounded-full border border-foreground bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors'
                    : 'inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground'
                }
              >
                {item}
              </button>
            );
          })}
        </div>
      )}

      {shown.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {shown.map((project, id) => {
            const key = projectKey(project);
            return (
              <BlurFade key={project._id ?? `${project.title}-${id}`} inView className="h-full">
                <ProjectCard
                  href={project.href}
                  detailHref={key ? `/${locale}/projects/${key}` : undefined}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  links={project.links}
                  liveLabel={t('visit')}
                  headingLevel="h2"
                  className="h-full"
                />
              </BlurFade>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">{t('noResults')}</p>
      )}

      {filtered.length > shown.length && (
        <div className="flex justify-center pt-1">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setVisible(value => value + PAGE_SIZE)}>
            {t('loadMore', { count: localizedCount(filtered.length - shown.length, lang) })}
          </Button>
        </div>
      )}
    </div>
  );
}
