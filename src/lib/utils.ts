import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, locale: "fa" | "en" = "en") {
  let currentDate = new Date().getTime();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date).getTime();
  let timeDifference = Math.abs(currentDate - targetDate);
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (locale === "fa") {
    // Use Persian (Jalaali) calendar formatting if available
    try {
      // Lazy require to avoid SSR bundling issues if not used
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moment = require("moment-jalaali");
      moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
      const m = moment(date);
      const fullDateFa = m.format("jD jMMMM jYYYY");

      if (daysAgo < 1) return "امروز";
      if (daysAgo < 7) return `${fullDateFa} (${daysAgo} روز پیش)`;
      if (daysAgo < 30) {
        const weeksAgo = Math.floor(daysAgo / 7);
        return `${fullDateFa} (${weeksAgo} هفته پیش)`;
      }
      if (daysAgo < 365) {
        const monthsAgo = Math.floor(daysAgo / 30);
        return `${fullDateFa} (${monthsAgo} ماه پیش)`;
      }
      const yearsAgo = Math.floor(daysAgo / 365);
      return `${fullDateFa} (${yearsAgo} سال پیش)`;
    } catch (e) {
      // Fallback to Intl if moment-jalaali is unavailable
      const fullDateFa = new Date(date).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return fullDateFa;
    }
  }

  const fullDate = new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (daysAgo < 1) return "Today";
  if (daysAgo < 7) return `${fullDate} (${daysAgo}d ago)`;
  if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}w ago)`;
  }
  if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}mo ago)`;
  }
  const yearsAgo = Math.floor(daysAgo / 365);
  return `${fullDate} (${yearsAgo}y ago)`;
}

// Format as Year Month with dual calendars, e.g.,
// fa -> "مهر ۱۴۰۳ (October 2024)"
// en -> "October 2024 (مهر ۱۴۰۳)"
export function formatYearMonthDual(date: string, locale: "fa" | "en" = "en") {
  if (!date) return "";

  // Robustly parse inputs like:
  // - ISO strings
  // - "YYYY/MM" where YYYY/MM is in Jalali when locale==='fa', Gregorian otherwise
  const parseInput = (input: string, inputLocale: "fa" | "en"): Date | null => {
    if (!input) return null;
    const ym = input.match(/^(\d{3,4})\/(\d{1,2})(?:\/(\d{1,2}))?$/);
    try {
      if (ym) {
        const year = parseInt(ym[1], 10);
        const month = parseInt(ym[2], 10);
        const day = ym[3] ? parseInt(ym[3], 10) : 1;
        if (inputLocale === "fa") {
          // Interpret as Jalali and convert to Gregorian Date
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const moment = require("moment-jalaali");
          moment.loadPersian({
            dialect: "persian-modern",
            usePersianDigits: true,
          });
          const m = moment(
            `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(
              2,
              "0"
            )}`,
            "jYYYY/jMM/jDD"
          );
          if (m.isValid()) return m.toDate();
        } else {
          // Gregorian year/month[/day]
          const iso = `${String(year).padStart(4, "0")}-${String(
            month
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const d = new Date(iso);
          if (!isNaN(d.getTime())) return d;
        }
      }
      // Fallbacks: ISO or general parsing
      const d = new Date(input);
      if (!isNaN(d.getTime())) return d;
    } catch {}
    return null;
  };

  const d = parseInput(date, locale) ?? new Date();

  // Gregorian part
  const greg = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Jalaali part
  let jalaali = "";
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const moment = require("moment-jalaali");
    moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
    // Month then Year to match "مهر ۱۴۰۴"
    jalaali = moment(d).format("jMMMM jYYYY");
  } catch (e) {
    // Fallback to fa-IR locale (not true Jalali on all runtimes, but acceptable fallback)
    jalaali = d.toLocaleDateString("fa-IR", { year: "numeric", month: "long" });
  }

  return locale === "fa" ? `${jalaali} (${greg})` : `${greg} (${jalaali})`;
}

// Locale-only Year Month format
export function formatYearMonthLocal(date: string, locale: "fa" | "en" = "en") {
  if (!date) return "";

  // Reuse the same parsing strategy as formatYearMonthDual
  const parseInput = (input: string, inputLocale: "fa" | "en"): Date | null => {
    if (!input) return null;
    const ym = input.match(/^(\d{3,4})\/(\d{1,2})(?:\/(\d{1,2}))?$/);
    try {
      if (ym) {
        const year = parseInt(ym[1], 10);
        const month = parseInt(ym[2], 10);
        const day = ym[3] ? parseInt(ym[3], 10) : 1;
        if (inputLocale === "fa") {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const moment = require("moment-jalaali");
          moment.loadPersian({
            dialect: "persian-modern",
            usePersianDigits: true,
          });
          const m = moment(
            `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(
              2,
              "0"
            )}`,
            "jYYYY/jMM/jDD"
          );
          if (m.isValid()) return m.toDate();
        } else {
          const iso = `${String(year).padStart(4, "0")}-${String(
            month
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const d = new Date(iso);
          if (!isNaN(d.getTime())) return d;
        }
      }
      const d = new Date(input);
      if (!isNaN(d.getTime())) return d;
    } catch {}
    return null;
  };

  const d = parseInput(date, locale) ?? new Date();

  if (locale === "fa") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moment = require("moment-jalaali");
      moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
      // Month then Year
      return moment(d).format("jMMMM jYYYY");
    } catch (e) {
      return d.toLocaleDateString("fa-IR", { year: "numeric", month: "long" });
    }
  }

  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}
