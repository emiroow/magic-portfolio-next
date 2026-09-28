<div align="center">

# Magic Portfolio Next

**A minimal, bilingual (EN/FA) developer portfolio with blog, admin dashboard and one-click Vercel deployment.**

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, MongoDB and next-intl.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-black)](https://ui.shadcn.com)
[![MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.md) · [فارسی](README.fa.md) · [Deploy to Vercel](#deploy-on-vercel)

</div>

---

## Features

- **Two languages, one codebase** — English (default, `/`) and Persian (`/fa`) with automatic RTL, Persian digits and Jalali (Solar Hijri) dates.
- **Strictly monochrome design system** — pure black & white shadcn/ui tokens, light/dark themes, subtle animations that respect `prefers-reduced-motion`.
- **Content dashboard** at `/{locale}/dashboard` — profile, work experience, education, skills, projects, socials and a Markdown blog editor. Every form has validation, loading, error and empty states.
- **Secure by default** — all admin APIs require a session; credentials live in server-only env vars; request bodies validated with Zod on the server.
- **Complete SEO** — per-page metadata, canonical + hreflang alternates, Open Graph / Twitter cards with a generated OG image, JSON-LD (Person, Blog, BlogPosting, BreadcrumbList), localized sitemap, robots, RSS feed and a web manifest.
- **Server-side data access** — pages read from Mongoose directly (no HTTP self-fetching); public JSON APIs stay available at `/api/{lang}`.
- **ISR + on-demand revalidation** — content edits refresh the public site immediately.
- **Fully typed** — strict TypeScript, shared domain types, ESLint (core-web-vitals + TypeScript) and `npm run verify` in one command.

## Quick start (5 minutes)

Prerequisites: **Node.js >= 20** and a MongoDB instance (local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster).

```bash
# 1. Clone and install
git clone https://github.com/emiroow/magic-portfolio-next.git
cd magic-portfolio-next
npm install            # pnpm install works too

# 2. Configure environment
cp .env.example .env.local
# then edit .env.local: set MONGODB_URI, NEXTAUTH_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD

# 3. Load demo content (optional but recommended)
npm run seed

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site serves `/en` and `/fa` from there.
The dashboard is at `/en/dashboard`. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env.local` — there are no demo or fallback accounts, and sign-in is refused entirely if those variables are missing.

## Scripts

| Script               | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `npm run dev`        | Start the development server                         |
| `npm run build`      | Production build                                     |
| `npm run start`      | Serve the production build                           |
| `npm run seed`       | Insert demo content (skips if DB is not empty)       |
| `npm run seed:force` | Drop the database, then seed demo content            |
| `npm run lint`       | ESLint                                               |
| `npm run typecheck`  | `tsc --noEmit`                                       |
| `npm run verify`     | Lint + typecheck + build — the CI/quality gate       |

## Environment variables

| Variable                      | Required | Description                                                        |
| ----------------------------- | -------- | ------------------------------------------------------------------ |
| `MONGODB_URI`                 | Yes      | MongoDB connection string                                          |
| `NEXT_PUBLIC_SITE_URL`        | Yes      | Canonical site origin (e.g. `https://portfolio.example.com`)       |
| `NEXTAUTH_SECRET`             | Yes      | Session encryption key — `openssl rand -base64 32`                 |
| `NEXTAUTH_URL`                | Prod     | Same origin as the app (NextAuth compatibility)                    |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Yes  | Dashboard credentials — required; no demo/fallback accounts        |
| `BLOB_READ_WRITE_TOKEN`       | Prod     | Vercel Blob token — required for image uploads in production       |
| `NEXT_PUBLIC_TWITTER_HANDLE`  | No       | `@handle` for Twitter cards                                        |
| `NEXT_PUBLIC_GA_ID`           | No       | Optional Google Analytics 4 ID                                     |

> The site title and meta description are **not** environment variables — they are built from the profile document you edit in the dashboard, as `Name | Job Title | Portfolio` (in Persian: `نام | عنوان شغلی | سایت شخصی`).

## Project structure

```
src/
├── app/
│   ├── [locale]/            # Localized routes (en default, fa with RTL)
│   │   ├── (client)/        # Home page (hero, about, experience, projects…)
│   │   ├── auth/            # Admin sign-in
│   │   ├── blog/            # Blog list, post pages and RSS route
│   │   └── dashboard/       # Admin dashboard (session protected)
│   ├── api/
│   │   ├── [lang]/          # Public JSON API (portfolio data, blog)
│   │   ├── [lang]/admin/    # Guarded CRUD APIs (Zod validated)
│   │   ├── auth/            # NextAuth
│   │   └── og/              # Generated Open Graph image
│   └── layout.tsx           # Fonts, global metadata, analytics
├── components/
│   ├── dashboard/           # Admin sections (one file per resource)
│   ├── home/ & sections/    # Public page sections
│   ├── magicui/             # Dock, blur-fade, flickering grid
│   └── ui/                  # shadcn/ui primitives (see components.json)
├── config/                  # NextAuth options + cached DB connection
├── hooks/                   # react-hook-form + react-query hooks
├── lib/                     # data layer, zod schemas, API helpers, utils
├── models/                  # Mongoose schemas
├── seed/                    # Demo content seeds (npm run seed)
├── types/                   # Shared domain types
└── i18n/                    # next-intl routing & request config
```

## Deploy on Vercel

1. Push this repository to GitHub.
2. On [Vercel](https://vercel.com/new), import the repo.
3. Add the environment variables (see the table above). Use a MongoDB **Atlas** connection string.
4. To enable image uploads, create a [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store — `BLOB_READ_WRITE_TOKEN` is injected automatically.
5. Deploy, then set `NEXT_PUBLIC_SITE_URL` to your final domain and redeploy once so metadata picks it up.

In production, uploads go to Vercel Blob; in development they are saved under `public/` — no extra setup for local work.

## Customization

- **Colors** — edit the CSS variables in `src/app/globals.css` (single source of truth for the monochrome theme).
- **Content** — everything is data-driven from MongoDB via the dashboard; re-run `npm run seed:force` to reset demo content.
- **Add a section** — create a model + types in `src/models` and `src/types`, expose it with `createAdminCrud` in `src/app/api/[lang]/admin/...`, and add a section component under `src/components/sections`.
- **Languages** — translations live in `messages/en.json` and `messages/fa.json`; locales are configured in `src/i18n/routing.ts`.

## Troubleshooting

| Symptom                                   | Fix                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| Home shows “No content yet”               | `MONGODB_URI` missing/incorrect — check `.env.local`, then `npm run seed` |
| Images fail in production                 | Set `BLOB_READ_WRITE_TOKEN` (Vercel Blob)                                 |
| Login redirects endlessly                 | `NEXTAUTH_URL` must match the deployed origin exactly                     |
| Persian dates look Gregorian              | Node >= 20 with full ICU (the official builds include it)                 |
| `npm run seed` says file `.env.local` not found | Create `.env.local` first (it is required by the seed script)        |

## Contributing

Issues and pull requests are welcome. Please run `npm run verify` before submitting — it is the exact CI gate (lint + typecheck + build).

## License

[MIT](LICENSE) — free to use for your personal portfolio, commercially and in derivative templates.
