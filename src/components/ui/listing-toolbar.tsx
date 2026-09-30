'use client';

import { FilterChip } from '@/components/ui/filter-chip';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

/** Chips shown before the “show the rest” control. */
const VISIBLE_FACETS = 10;

interface ListingToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  /** Doubles as the placeholder and the accessible name. */
  searchLabel: string;
  clearSearchLabel: string;
  /** Facet values rendered as chips. */
  options: readonly string[];
  active: string | null;
  onPick: (value: string | null) => void;
  /** Trailing line aligned to the end of the search row, e.g. the result count. */
  meta?: ReactNode;
  clearLabel: string;
  onClear: () => void;
}

/**
 * The only chrome a public listing gets: one quiet search field and a single
 * row of facet chips. There is no “All” chip — pressing the active chip clears
 * it — and the reset action only appears once something is actually filtered.
 */
export function ListingToolbar({
  query,
  onQueryChange,
  searchLabel,
  clearSearchLabel,
  options,
  active,
  onPick,
  meta,
  clearLabel,
  onClear,
}: ListingToolbarProps) {
  const [expanded, setExpanded] = useState(false);
  const filtering = Boolean(query.trim()) || active !== null;

  // A facet selected elsewhere (a `?tag=` link, say) is never hidden behind the expander.
  const collapsed = options.length > VISIBLE_FACETS && !expanded && (!active || options.indexOf(active) < VISIBLE_FACETS);
  const visibleOptions = collapsed ? options.slice(0, VISIBLE_FACETS) : options;

  return (
    <div className="flex flex-col gap-3" role="search">
      <div className="flex items-center gap-4">
        <div className="relative min-w-0 flex-1 sm:max-w-[240px]">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            placeholder={searchLabel}
            aria-label={searchLabel}
            className="h-9 rounded-full border-transparent bg-muted/50 ps-8 pe-8 text-sm shadow-none transition-colors placeholder:text-muted-foreground hover:bg-muted focus-visible:ring-2 md:text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label={clearSearchLabel}
              className="absolute end-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3" aria-hidden />
            </button>
          )}
        </div>

        {meta && (
          <p aria-live="polite" className="ms-auto shrink-0 text-xs tabular-nums text-muted-foreground">
            {meta}
          </p>
        )}
      </div>

      {(options.length > 0 || filtering) && (
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {visibleOptions.map(option => (
            <FilterChip key={option} active={active === option} onClick={() => onPick(active === option ? null : option)}>
              {option}
            </FilterChip>
          ))}

          {collapsed && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex shrink-0 items-center rounded-full border border-dashed px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              +{options.length - VISIBLE_FACETS}
            </button>
          )}

          {filtering && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground',
                options.length === 0 && 'px-1'
              )}
            >
              <X className="size-3" aria-hidden />
              {clearLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
