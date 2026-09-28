<div align="center" dir="rtl">

# مژیک پورتفولیو نکست

**یک وب‌سایت نمونه‌کار مینیمال و دوزبانه (فارسی/انگلیسی) همراه با وبلاگ، داشبورد مدیریت و استقرار با یک کلیک روی Vercel.**

ساخته‌شده با Next.js 16 (App Router)، TypeScript، Tailwind CSS، shadcn/ui، MongoDB و next-intl.

[فارسی](README.fa.md) · [English](README.md)

</div>

---

## امکانات

- **دوزبانه با پشتیبانی کامل RTL** — انگلیسی پیش‌فرض (`/`) و فارسی (`/fa`) با اعداد فارسی و تاریخ جلالی.
- **سیستم طراحی کاملاً سیاه‌وسفید** — توکن‌های shadcn/ui، پوسته روشن/تاریک و انیمیشن‌های ملایم با رعایت `prefers-reduced-motion`.
- **داشبورد مدیریت** در `/{locale}/dashboard` — پروفایل، سوابق کاری، تحصیلات، مهارت‌ها، پروژه‌ها، شبکه‌های اجتماعی و ویرایشگر Markdown وبلاگ؛ همراه با اعتبارسنجی، حالت بارگذاری، خطا و خالی.
- **امن به‌صورت پیش‌فرض** — تمام APIهای مدیریتی نیازمند نشست (session) هستند؛ نام کاربری و رمز عبور فقط در متغیرهای سمت سرور؛ اعتبارسنجی بدنه درخواست‌ها با Zod.
- **سئوی کامل** — متادیتای هر صفحه، canonical و hreflang، Open Graph/Twitter با تصویر OG تولیدی، JSON-LD، نقشه سایت محلی‌سازی‌شده، robots، فید RSS و manifest.
- **دسترسی مستقیم سروری به دیتابیس** (بدون self-fetch) + ISR و revalidate هنگام تغییر محتوا.
- **کاملاً تایپ‌شده** — TypeScript سخت‌گیر، ESLint و یکپارچه `npm run verify`.

## راه‌اندازی سریع

پیش‌نیازها: **Node.js نسخه ۲۰ یا بالاتر** و یک دیتابیس MongoDB (لوکال یا اطلس).

```bash
# ۱. کلون و نصب وابستگی‌ها
git clone https://github.com/emiroow/magic-portfolio-next.git
cd magic-portfolio-next
npm install

# ۲. تنظیم متغیرهای محیطی
cp .env.example .env.local
# مقادیر MONGODB_URI و NEXTAUTH_SECRET را وارد کنید

# ۳. بارگذاری محتوای نمونه (اختیاری، پیشنهاد می‌شود)
npm run seed

# ۴. اجرای محیط توسعه
npm run dev
```

آدرس [http://localhost:3000](http://localhost:3000) را باز کنید. داشبورد در `/fa/dashboard` در دسترس است
(اطلاعات ورود نمونه: `admin@example.com` / `admin1234` — با `ADMIN_EMAIL` و `ADMIN_PASSWORD` قابل تغییر).

## اسکریپت‌ها

| اسکریپت              | توضیح                                            |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | اجرای سرور توسعه                                 |
| `npm run build`      | بیلد پروداکشن                                    |
| `npm run start`      | اجرای بیلد پروداکشن                              |
| `npm run seed`       | درج محتوای نمونه (در دیتابیس خالی)               |
| `npm run seed:force` | حذف دیتابیس و درج مجدد محتوای نمونه             |
| `npm run lint`       | ESLint                                           |
| `npm run typecheck`  | بررسی تایپ‌ها                                     |
| `npm run verify`     | لینت + تایپ‌چک + بیلد (دروازه کیفیت CI)            |

## استقرار روی Vercel

1. ریپازیتوری را روی GitHub پوش کنید.
2. در [Vercel](https://vercel.com/new) پروژه را Import کنید.
3. متغیرهای محیطی را اضافه کنید (برای دیتابیس از MongoDB Atlas استفاده کنید).
4. برای آپلود تصویر، یک استور [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) بسازید؛ توکن `BLOB_READ_WRITE_TOKEN` به‌صورت خودکار تزریق می‌شود.
5. استقرار را انجام دهید و سپس `NEXT_PUBLIC_SITE_URL` را روی دامنه نهایی تنظیم و یک‌بار مجدد deploy کنید.

## سفارشی‌سازی

- **رنگ‌ها:** متغیرهای CSS در `src/app/globals.css`
- **محتوا:** همه‌چیز از طریق داشبورد و دیتابیس مدیریت می‌شود
- **زبان‌ها:** فایل‌های `messages/en.json` و `messages/fa.json`
- **ساختار پروژه:** مستندات کامل در [README.md](README.md#project-structure)

## عیب‌یابی

| مشکل                                        | راه‌حل                                                            |
| ------------------------------------------- | ----------------------------------------------------------------- |
| پیام «هنوز محتوایی وجود ندارد»              | بررسی `MONGODB_URI` در `.env.local` سپس اجرای `npm run seed`     |
| خطای تصویر در پروداکشن                      | تنظیم `BLOB_READ_WRITE_TOKEN`                                     |
| ریدایرکت بی‌پایان در ورود                   | `NEXTAUTH_URL` باید دقیقاً با آدرس استقرار یکی باشد              |
| تاریخ فارسی میلادی نمایش داده می‌شود        | به Node نسخه ۲۰ یا بالاتر با ICU کامل نیاز است                    |

## مشارکت

مسئله و Pull Request خوش‌آمد است. لطفاً قبل از ارسال، `npm run verify` را اجرا کنید.

## مجوز

[MIT](LICENSE)
