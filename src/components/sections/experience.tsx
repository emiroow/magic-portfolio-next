import { ResumeCard } from '@/components/resume-card';
import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader } from '@/components/sections/section-header';
import { formatYearMonthLocal } from '@/lib/utils';
import type { AppLocale, IWork } from '@/types';

interface ExperienceProps {
  title: string;
  works: IWork[];
  locale: AppLocale;
  presentLabel: string;
  delay?: number;
}

/** Work history timeline. */
export function Experience({ title, works, locale, presentLabel, delay = 0 }: ExperienceProps) {
  if (!works.length) return null;

  return (
    <section id="experience" className="flex min-h-0 flex-col gap-y-3">
      <SectionHeader title={title} delay={delay} />
      {works.map((work, id) => (
        <BlurFade key={work._id ?? `${work.company}-${id}`} delay={delay + 0.06 + id * 0.05}>
          <ResumeCard
            logoUrl={work.logoUrl}
            altText={work.company}
            title={work.company}
            subtitle={work.title}
            href={work.href}
            period={`${formatYearMonthLocal(work.start, locale)}${work.start && work.end ? ' – ' : ''}${
              work.end ? formatYearMonthLocal(work.end, locale) : work.start ? presentLabel : ''
            }`}
            description={work.description}
          />
        </BlurFade>
      ))}
    </section>
  );
}
