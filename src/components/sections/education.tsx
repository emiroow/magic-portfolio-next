import { ResumeCard } from '@/components/resume-card';
import BlurFade from '@/components/magicui/blur-fade';
import { SectionHeader } from '@/components/sections/section-header';
import { formatYearMonthLocal } from '@/lib/utils';
import type { AppLocale, IEducation } from '@/types';

interface EducationProps {
  title: string;
  educations: IEducation[];
  locale: AppLocale;
  delay?: number;
}

/** Education timeline. */
export function Education({ title, educations, locale, delay = 0 }: EducationProps) {
  if (!educations.length) return null;

  return (
    <section id="education" className="flex min-h-0 flex-col gap-y-3">
      <SectionHeader title={title} delay={delay} />
      {educations.map((education, id) => (
        <BlurFade key={education._id ?? `${education.school}-${id}`} delay={delay + 0.06 + id * 0.05}>
          <ResumeCard
            href={education.href}
            logoUrl={education.logoUrl}
            altText={education.school}
            title={education.school}
            subtitle={education.degree}
            period={`${formatYearMonthLocal(education.start, locale)}${education.start && education.end ? ' – ' : ''}${formatYearMonthLocal(
              education.end,
              locale
            )}`}
          />
        </BlurFade>
      ))}
    </section>
  );
}
