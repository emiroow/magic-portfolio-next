import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PERSIAN_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

/** Convert ASCII digits in a string to Persian digits. */
function toPersianDigits(input: string) {
  return input.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

/**
 * Format a date-ish string as locale "Month YYYY" (Jalali for fa).
 * Accepts `YYYY/MM` or ISO strings; e.g. "مهر ۱۴۰۳", "October 2024".
 */
export function formatYearMonthLocal(date: string | undefined, locale: 'fa' | 'en' = 'en'): string {
  if (!date) return '';

  // Calendar-style "YYYY/M[M]" input.
  const ym = date.match(/^(\d{3,4})\/(\d{1,2})$/);
  if (ym) {
    const year = Number(ym[1]);
    const month = Number(ym[2]);

    if (locale === 'fa' && month >= 1 && month <= 12) {
      return `${PERSIAN_MONTHS[month - 1]} ${toPersianDigits(String(year))}`;
    }

    const d = new Date(Date.UTC(year, Math.max(0, month - 1), 1));
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
  }

  // Fall back to calendar-aware Intl formatting for anything Date accepts.
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  if (locale === 'fa') {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'long' }).format(parsed);
  }
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(parsed);
}

/** Truncate a string on a word boundary and append an ellipsis. */
export function truncate(text: string | undefined, max = 160): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`;
}

/** Estimate reading time in minutes (~200 words per minute). */
export function readingTime(text: string | undefined): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
