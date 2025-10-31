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
// fa -> "1403 مهر (October 2024)"
// en -> "October 2024 (1403 مهر)"
export function formatYearMonthDual(date: string, locale: "fa" | "en" = "en") {
  if (!date) return "";
  if (!date.includes("T")) date = `${date}T00:00:00`;
  const d = new Date(date);

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
    jalaali = moment(d).format("jYYYY jMMMM");
  } catch (e) {
    // Fallback to fa-IR locale (not true Jalali on all runtimes, but acceptable fallback)
    jalaali = d.toLocaleDateString("fa-IR", { year: "numeric", month: "long" });
  }

  return locale === "fa" ? `${jalaali} (${greg})` : `${greg} (${jalaali})`;
}

// Locale-only Year Month format
export function formatYearMonthLocal(date: string, locale: "fa" | "en" = "en") {
  if (!date) return "";
  if (!date.includes("T")) date = `${date}T00:00:00`;
  const d = new Date(date);

  if (locale === "fa") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moment = require("moment-jalaali");
      moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
      return moment(d).format("jYYYY jMMMM");
    } catch (e) {
      return d.toLocaleDateString("fa-IR", { year: "numeric", month: "long" });
    }
  }

  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}
