'use client';

import { EmptyPanel } from '@/components/empty-panel';
import BlurFade from '@/components/magicui/blur-fade';
import { ProjectCard } from '@/components/project-card';
import { FilterChip } from '@/components/ui/filter-chip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { localizedCount, projectKey } from '@/lib/utils';
import type { AppLocale, IProject } from '@/types';
import { FolderGit2, Search, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

/** Projects rendered before the “load more” control appears. */
const PAGE_SIZE = 6;

interface ProjectsGridProps {
  projects: IProject[];
  technologies: string[];
}

/**
 * Project archive: instant search plus a technology filter, on the same
 * card grid and with the same controls as the blog listing.
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

  const filtering = Boolean(query.trim() || tech);
  const shown = filtered.slice(0, visible);

  const pickTech = (value: string | null) => {
    setTech(value);
    setVisible(PAGE_SIZE);
  };

  const clearAll = () => {
    setQuery('');
    pickTech(null);
  };

  if (!projects.length) {
    return <EmptyPanel icon={<FolderGit2 className="size-5 text-muted-foreground" />} text={t('empty')} />;
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

        {/* Only useful while it differs from the total in the page header. */}
        {filtering && (
          <p aria-live="polite" className="text-xs tabular-nums text-muted-foreground sm:ms-auto">
            {t('count', { count: localizedCount(filtered.length, lang) })}
          </p>
        )}
      </div>

      {technologies.length > 0 && (
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <FilterChip active={!tech} onClick={() => pickTech(null)}>
            {t('allTags')}
          </FilterChip>
          {technologies.map(item => (
            <FilterChip key={item} active={tech === item} onClick={() => pickTech(tech === item ? null : item)}>
              {item}
            </FilterChip>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        <>
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
                    priority={id < 2}
                    className="h-full"
                  />
                </BlurFade>
              );
            })}
          </div>

          {filtered.length > shown.length && (
            <div className="flex justify-center pt-1">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setVisible(value => value + PAGE_SIZE)}>
                {t('loadMore', { count: localizedCount(filtered.length - shown.length, lang) })}
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyPanel
          icon={<Search className="size-5 text-muted-foreground" />}
          text={t('noResults')}
          actionLabel={t('clearFilters')}
          onAction={clearAll}
        />
      )}
    </div>
  );
}
