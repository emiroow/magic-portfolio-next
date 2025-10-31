<div align="center">
  <h1>Magic Portfolio Next</h1>
  <p>Open‑source, bilingual (FA/EN) portfolio + blog + dashboard built with Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, next‑intl, and MongoDB.</p>

  <p>
    <a href="#">English</a> ·
    <a href="./README.fa.md">فارسی</a>
  </p>

  <p>
    <a href="https://nextjs.org"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" /></a>
    <a href="https://tailwindcss.com"><img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white" /></a>
    <a href="https://ui.shadcn.com/"><img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn/ui-Components-000" /></a>
    <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Femiroow%2Fmagic-portfolio-next"><img alt="Deploy with Vercel" src="https://vercel.com/button" /></a>
    <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
  </p>
</div>

## Overview

Magic Portfolio Next is a production‑ready portfolio template with:

- App Router (Next.js 14) + TypeScript
- Design system via Tailwind CSS and shadcn/ui
- Internationalization with next‑intl (fa, en) and automatic RTL for Persian
- Blog support (MDX and MongoDB via Mongoose model)
- Auth (NextAuth Credentials, demo‑friendly)
- Dashboard sections (profile, projects, education, skills, socials, work)
- SEO: metadata, sitemap, robots, manifest, and JSON‑LD component

Ideal for quickly launching a personal site, customizing, and deploying to Vercel.

## Live Demo

- Demo URL: Add your deployment link here (e.g., Vercel) once deployed

## Features

- Next.js 14 App Router with strict typing
- Bilingual (fa/en) with default locale fa and RTL support
- MDX rendering and code highlighting via Shiki/rehype‑pretty‑code
- MongoDB/Mongoose models and seed scripts to bootstrap content
- Credentials‑based auth with easily configurable demo credentials
- Responsive UI with Tailwind and shadcn/ui components
- SEO‑friendly: canonical, alternates, sitemap, robots, manifest, JSON‑LD
- Ready for Vercel with a one‑click deploy button

## Tech Stack

- Framework: Next.js 14 (React 18)
- Language: TypeScript
- Styling: Tailwind CSS, shadcn/ui, Framer Motion
- i18n: next‑intl (locales: fa, en)
- Data: MongoDB + Mongoose
- Auth: NextAuth (Credentials)
- Content: MDX (unified/remark/rehype)

## Quick Start

Prerequisites:

- Node.js >= 18
- pnpm or npm
- MongoDB (local or Atlas)

Steps:

1. Clone the repo
2. Install dependencies
3. Create and fill `.env.local` (see below)
4. Seed sample data (optional)
5. Run the dev server

```bash
# Install
pnpm install

# Seed database (optional – requires Mongo running)
pnpm run seed

# Start development
pnpm run dev
```

## Environment Variables

Create `.env.local` in the project root:

```env
# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Public API base (used by Axios client)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database
DB_CONNECTION=mongodb://localhost:27017/Magic

# Auth (required in production)
NEXTAUTH_SECRET=replace-with-strong-secret
NEXTAUTH_URL=https://your-domain.com

# Demo credentials (used by Credentials provider)
NEXT_PUBLIC_DEMO_EMAIL=admin@example.com
NEXT_PUBLIC_DEMO_PASSWORD=admin1234
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is used for SEO metadata base/canonical.
- `DB_CONNECTION` is read by `src/config/dbConnection.ts`.
- Credentials provider accepts only the demo pair unless you extend it.

## Localization

- Locales: `fa`, `en` (default: `fa`) configured in `src/i18n/routing.ts`.
- Automatic RTL for Persian is set in `src/app/layout.tsx`.
- Middleware enforces localized routes: see `src/middleware.ts`.

## SEO

- Global metadata in `src/app/layout.tsx` (title, description, canonical, alternates)
- `src/app/robots.ts` for robots.txt
- `src/app/sitemap.ts` for a localized sitemap
- `src/app/manifest.ts` for PWA manifest
- `src/components/JsonLd.tsx` to inject structured data (schema.org)

## Project Structure

Key folders:

- `src/app/[locale]` – localized routes (blog, dashboard, auth)
- `src/components` – UI, dashboard modules, MDX, theme toggles
- `src/models` – Mongoose models (blog, profile, etc.)
- `src/seed` – seed scripts and sample data
- `src/config` – auth and database connection
- `src/i18n` – routing and helpers for next‑intl
- `messages` – translation messages (en/fa)
- `content` – sample MDX content

## Development

Useful scripts:

```bash
pnpm run dev        # Start dev server
pnpm run lint       # Lint with ESLint
pnpm run typecheck  # TypeScript type check
pnpm run build      # Production build
pnpm run start      # Start production server
pnpm run seed       # Seed MongoDB with sample data
```

## Deployment

1. Set env vars on your host (Vercel recommended)
2. Ensure `NEXTAUTH_SECRET` is set (required in prod)
3. Provide `DB_CONNECTION` to your MongoDB instance
4. Build and deploy

One‑click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Femiroow%2Fmagic-portfolio-next)

## Contributing

Contributions are welcome! Please:

- Open an issue to discuss major changes
- Fork the repo, create a feature branch, and open a PR

## License

MIT © 2025 — See [LICENSE](./LICENSE)

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the UI primitives
- [magicui.design](https://magicui.design/) components included in `src/components/magicui`
- [next-intl](https://next-intl-docs.vercel.app/) for localization
