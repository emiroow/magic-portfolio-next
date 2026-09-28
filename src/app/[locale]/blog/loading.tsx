import { Skeleton } from '@/components/ui/skeleton';
import { getLocale, getTranslations } from 'next-intl/server';

/** Blog skeleton: page header, search field and divided post rows. */
export default async function BlogLoading() {
  const locale = await getLocale();
  const t = await getTranslations({ locale });

  return (
    <div className="space-y-7" aria-busy="true" aria-label={t('loading')}>
      <div className="space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-px w-full" />
      </div>

      <Skeleton className="h-10 w-full rounded-full" />

      <div className="overflow-hidden rounded-xl border">
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 p-4 sm:px-5 sm:py-5">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
