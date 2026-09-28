'use client';

import { Dock, DockIcon } from '@/components/magicui/dock';
import { iconDecider } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NavbarRoutes } from '@/constants/global';
import { Link } from '@/i18n/routing';
import type { ISocial } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { ModeToggle } from './mode-toggle';
import ThemeToggle from './theme-toggle';

interface NavbarProps {
  socials?: ISocial[];
}

/**
 * Floating dock navigation: pages, social profiles, language switch and
 * theme switch. Icons are decorated with tooltips; labels are translated.
 */
const Navbar: FC<NavbarProps> = ({ socials = [] }) => {
  const t = useTranslations('navbar');

  const socialLabel = (icon: string, name: string) => {
    const key = icon?.toLowerCase();
    // Fall back to the stored display name for unknown icons.
    return t.has(`social.${key}`) ? t(`social.${key}` as string) : name;
  };

  return (
    <nav
      aria-label={t('label')}
      className="pointer-events-none fixed inset-x-0 bottom-3 z-30 mx-auto flex h-full max-h-14 origin-bottom items-end justify-center pb-1"
    >
      {/* Soft fade behind the dock */}
      <div className="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent [-webkit-mask-image:linear-gradient(to_top,black,transparent)] backdrop-blur-lg" />

      <Dock
        magnification={110}
        distance={40}
        className="pointer-events-auto relative z-50 flex min-h-full items-center gap-1 rounded-2xl border bg-background px-2 shadow-lg"
      >
        {NavbarRoutes().map(item => {
          const { href, icon: Icon } = item;
          const label = href === '/' ? t('home') : t('blog');
          return (
            <DockIcon key={href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={href} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))} aria-label={label}>
                    <Icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          );
        })}

        {socials.length > 0 && <Separator orientation="vertical" className="!my-2 !h-auto" />}

        {socials.map((item, index) => (
          <DockIcon key={item._id ?? `${item.name}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabel(item.icon, item.name)}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
                >
                  {iconDecider(item.icon, 'size-4')}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{socialLabel(item.icon, item.name)}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}

        <Separator orientation="vertical" className="!my-2 !h-auto" />

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ThemeToggle className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('language')}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('theme')}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </nav>
  );
};

export default Navbar;
