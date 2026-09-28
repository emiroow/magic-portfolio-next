'use client';

import BlurFade from '@/components/magicui/blur-fade';
import BlurFadeText from '@/components/magicui/blur-fade-text';
import { eyebrowClass } from '@/components/sections/section-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import type { IProfile } from '@/types';

interface HeroProps {
  profile: IProfile;
  /** Eyebrow line rendered above the name. */
  greeting: string;
  /** Label for the mailto shortcut; the button is hidden without it. */
  emailLabel?: string;
  /** Base delay for the entrance stagger. */
  delay?: number;
}

/**
 * Intro block: eyebrow greeting, name, role, summary and portrait.
 * Stacks portrait-first on small screens and sits side by side from `sm`.
 */
export function Hero({ profile, greeting, emailLabel, delay = 0 }: HeroProps) {
  const name = profile.fullName?.trim() || profile.name?.trim() || '';
  const monogram = (name || '?').charAt(0);

  return (
    <section id="hero">
      <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div className="min-w-0 flex-1">
          <BlurFade delay={delay}>
            <p className={eyebrowClass}>{greeting}</p>
          </BlurFade>

          <BlurFadeText
            delay={delay + 0.06}
            containerClassName="mt-3"
            className="text-3xl font-bold leading-[1.15] ltr:tracking-tight sm:text-4xl xl:text-5xl"
            text={name}
          />

          {profile.jobTitle && (
            <BlurFade delay={delay + 0.12}>
              <p className="mt-4 flex items-center gap-3 text-sm font-medium sm:text-base">
                <span aria-hidden className="h-px w-8 shrink-0 bg-foreground/30" />
                {profile.jobTitle}
              </p>
            </BlurFade>
          )}

          {profile.summary && (
            <BlurFade delay={delay + 0.18}>
              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {profile.summary}
              </p>
            </BlurFade>
          )}

          {profile.email && emailLabel && (
            <BlurFade delay={delay + 0.24}>
              <div className="mt-7">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="me-2 size-4" />
                    {emailLabel}
                  </a>
                </Button>
              </div>
            </BlurFade>
          )}
        </div>

        <BlurFade delay={delay + 0.1} className="shrink-0">
          <div className="group relative">
            <Avatar className="size-24 border shadow-sm sm:size-28 lg:size-32">
              {profile.avatarUrl && (
                <AvatarImage
                  src={profile.avatarUrl}
                  alt={name}
                  className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                />
              )}
              <AvatarFallback className="text-2xl font-bold">{monogram}</AvatarFallback>
            </Avatar>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
