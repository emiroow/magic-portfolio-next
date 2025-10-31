<div align="center">
  <h1>پورتفولیوی جادویی (Magic Portfolio Next)</h1>
  <p>قالب اوپن‌سورس، دوزبانه (فارسی/انگلیسی) برای پورتفولیو + بلاگ + داشبورد با Next.js 14، تایپ‌اسکریپت، Tailwind CSS، shadcn/ui، next-intl و MongoDB.</p>

  <p>
    <a href="./README.md">English</a> ·
    <a href="#">فارسی</a>
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

## معرفی

«Magic Portfolio Next» یک قالب آمادهٔ پروداکشن برای راه‌اندازی سریع وب‌سایت شخصی است که شامل موارد زیر می‌شود:

- App Router نکست‌جی‌اس ۱۴ + تایپ‌اسکریپت
- سیستم طراحی با Tailwind و shadcn/ui
- بین‌المللی‌سازی با next-intl (فارسی و انگلیسی) و پشتیبانی RTL
- بلاگ با پشتیبانی از MDX و مدل‌های MongoDB/Mongoose
- احراز هویت با NextAuth (ارائه‌دهندهٔ Credentials)
- صفحات داشبورد (پروفایل، پروژه‌ها، تحصیلات، مهارت‌ها، شبکه‌های اجتماعی، سوابق کاری)
- سئو کامل: متا دیتا، سایت‌مپ، robots، manifest و JSON-LD

## پیش‌نمایش

- لینک دمو: پس از انتشار در ورسل یا هاست خودتان اینجا را تکمیل کنید

## ویژگی‌ها

- نکست‌جی‌اس ۱۴ (App Router) با تایپ‌اسکریپت
- دوزبانه (fa/en) با پیش‌فرض «فارسی» و راست‌به‌چپ خودکار
- رندر MDX و های‌لایت کد (Shiki/rehype-pretty-code)
- پایگاه‌دادهٔ MongoDB با Mongoose + اسکریپت Seed برای دادهٔ نمونه
- ورود مبتنی بر Credentials با مقادیر دمو قابل تغییر
- رابط کاربری واکنش‌گرا با Tailwind و shadcn/ui
- مناسب برای سئو: canonical، alternates، sitemap، robots، manifest، JSON-LD
- آمادهٔ دیپلوی روی ورسل (یک‌کلیک)

## تکنولوژی‌ها

- فریم‌ورک: Next.js 14 (React 18)
- زبان: TypeScript
- استایل: Tailwind CSS، shadcn/ui، Framer Motion
- i18n: کتابخانهٔ next-intl (fa, en)
- داده: MongoDB + Mongoose
- احراز هویت: NextAuth (Credentials)
- محتوا: MDX (unified/remark/rehype)

## شروع سریع

پیش‌نیازها:

- Node.js نسخهٔ ۱۸ یا بالاتر
- pnpm یا npm
- MongoDB (لوکال یا اطلس)

مراحل:

1. ریپو را کلون کنید
2. پکیج‌ها را نصب کنید
3. فایل `.env.local` بسازید و مقداردهی کنید (لیست زیر)
4. (اختیاری) دادهٔ نمونه را Seed کنید
5. سرور توسعه را اجرا کنید

```bash
# نصب وابستگی‌ها
pnpm install

# ایجاد دادهٔ نمونه (Mongo باید در حال اجرا باشد)
pnpm run seed

# اجرای توسعه
pnpm run dev
```

## متغیرهای محیطی

فایل `.env.local` را در ریشهٔ پروژه بسازید:

```env
# سایت
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# API عمومی (برای Axios سمت کلاینت)
NEXT_PUBLIC_API_URL=http://localhost:3000

# دیتابیس
DB_CONNECTION=mongodb://localhost:27017/Magic

# احراز هویت (در محیط پروداکشن الزامی)
NEXTAUTH_SECRET=replace-with-strong-secret
NEXTAUTH_URL=https://your-domain.com

# اطلاعات ورود نمایشی (برای Provider از نوع Credentials)
NEXT_PUBLIC_DEMO_EMAIL=admin@example.com
NEXT_PUBLIC_DEMO_PASSWORD=admin1234
```

نکات:

- `NEXT_PUBLIC_SITE_URL` برای ساخت canonical/metadata base استفاده می‌شود.
- `DB_CONNECTION` در `src/config/dbConnection.ts` خوانده می‌شود.
- ورود فقط جفت «ایمیل/پسورد» نمایشی را می‌پذیرد مگر اینکه منطق را گسترش دهید.

## محلی‌سازی (i18n)

- زبان‌ها: `fa` و `en` (پیش‌فرض: `fa`) در `src/i18n/routing.ts`
- راست‌به‌چپ خودکار برای فارسی در `src/app/layout.tsx`
- میان‌افزار (Middleware) برای مسیرهای محلی‌سازی‌شده: `src/middleware.ts`

## سئو

- متا دیتای سراسری در `src/app/layout.tsx`
- `src/app/robots.ts` برای robots.txt
- `src/app/sitemap.ts` برای سایت‌مپ دوزبانه
- `src/app/manifest.ts` برای PWA manifest
- `src/components/JsonLd.tsx` برای درج دادهٔ ساختاریافته (schema.org)

## ساختار پروژه (خلاصه)

- `src/app/[locale]` — مسیرهای دوزبانه (بلاگ، داشبورد، احراز هویت)
- `src/components` — اجزای UI، ماژول‌های داشبورد، MDX، تم
- `src/models` — مدل‌های Mongoose (بلاگ، پروفایل، ...)
- `src/seed` — اسکریپت‌های Seed و دادهٔ نمونه
- `src/config` — احراز هویت و اتصال دیتابیس
- `src/i18n` — تنظیمات مسیر و ناوبری next-intl
- `messages` — فایل‌های ترجمه (fa/en)
- `content` — محتوای نمونهٔ MDX

## توسعه

```bash
pnpm run dev        # اجرای توسعه
pnpm run lint       # بررسی ESLint
pnpm run typecheck  # چک تایپ‌اسکریپت
pnpm run build      # ساخت پروداکشن
pnpm run start      # اجرای سرور پروداکشن
pnpm run seed       # Seed کردن دیتابیس
```

## استقرار

1. متغیرهای محیطی را در هاست (پیشنهادی: Vercel) تنظیم کنید
2. `NEXTAUTH_SECRET` را حتماً در پروداکشن مقداردهی کنید
3. `DB_CONNECTION` را به دیتابیس MongoDB خود اشاره دهید
4. Build و Deploy کنید

دیپلوی یک‌کلیکی در ورسل:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Femiroow%2Fmagic-portfolio-next)

## مشارکت

از مشارکت شما استقبال می‌شود! برای تغییرات بزرگ ابتدا یک Issue باز کنید، سپس Fork کنید، Branch بسازید و PR بدهید.

## مجوز

MIT © 2025 — فایل [LICENSE](./LICENSE) را ببینید

## تقدیر و تشکر

- [shadcn/ui](https://ui.shadcn.com/) برای کامپوننت‌ها
- کامپوننت‌های [magicui.design](https://magicui.design/) در `src/components/magicui`
- [next-intl](https://next-intl-docs.vercel.app/) برای بین‌المللی‌سازی
