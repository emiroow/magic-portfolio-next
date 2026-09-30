import { Home, NotebookText } from 'lucide-react';

/**
 * Primary dock navigation. Hrefs are locale-relative; the localized
 * `Link` wrapper prepends the active locale automatically. `label` is a key
 * under `navbar`. The project archive is reached from the home section
 * itself, so it stays out of the dock.
 */
export const NavbarRoutes = () => [{ href: '/', icon: Home, label: 'home' }, { href: '/blog', icon: NotebookText, label: 'blog' }] as const;

/**
 * Project slots on the home page. The dashboard caps how many projects can be
 * featured at this number, and the section fills any leftover slot with the
 * newest published project, so the row is never left half empty.
 */
export const HOME_PROJECT_SLOTS = 3;
