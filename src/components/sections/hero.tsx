'use client';

import BlurFade from '@/components/magicui/blur-fade';
import BlurFadeText from '@/components/magicui/blur-fade-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { IProfile } from '@/types';

interface HeroProps {
  profile: IProfile;
  greeting: string;
  /** Base delay for the entrance stagger. */
  delay?: number;
}

/** Intro block: greeting, role headline, short summary and avatar. */
export function Hero({ profile, greeting, delay = 0 }: HeroProps) {
  const headline = [profile.name, profile.jobTitle].filter(Boolean).join(' — ');

  return (
    <section id="hero" className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1 space-y-3">
        <BlurFadeText
          delay={delay + 0.04}
          className="text-lg font-bold tracking-tighter sm:text-2xl xl:text-3xl/none"
          text={`${greeting} ${profile.name ?? profile.fullName} 👋`}
        />
        {headline && (
          <BlurFade delay={delay + 0.12}>
            <p className="text-sm font-medium text-muted-foreground sm:text-base">{profile.jobTitle}</p>
          </BlurFade>
        )}
        {profile.summary && (
          <BlurFade delay={delay + 0.2}>
            <p className="max-w-[600px] text-xs leading-relaxed text-muted-foreground md:text-base">{profile.summary}</p>
          </BlurFade>
        )}
      </div>

      {profile.avatarUrl && (
        <BlurFade delay={delay + 0.08}>
          <Avatar className="size-24 border sm:size-32">
            <AvatarImage src={profile.avatarUrl} alt={profile.fullName || profile.name} />
            <AvatarFallback className="text-lg font-bold">{(profile.name || profile.fullName || '?').slice(0, 1)}</AvatarFallback>
          </Avatar>
        </BlurFade>
      )}
    </section>
  );
}
