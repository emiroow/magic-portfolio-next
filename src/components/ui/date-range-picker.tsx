"use client";

import { cn } from "@/lib/utils";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

interface DateRangePickerProps {
  startValue?: string;
  endValue?: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  locale?: "fa" | "en";
  theme?: "dark" | "light";
  startLabel: string;
  endLabel: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  error?: {
    start?: string;
    end?: string;
  };
}

export const DateRangePicker = ({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  locale = "en",
  theme = "light",
  startLabel,
  endLabel,
  startPlaceholder,
  endPlaceholder,
  disabled = false,
  error,
}: DateRangePickerProps) => {
  const calendar = locale === "fa" ? persian : gregorian;
  const calendarLocale = locale === "fa" ? persian_fa : gregorian_en;

  // Parse "YYYY/MM" format
  const parseMonthYear = (value?: string) => {
    if (!value) return null;
    const parts = value.split("/");
    if (parts.length === 2) {
      return new DateObject({
        date: `${parts[0]}/${parts[1]}/01`,
        calendar,
        locale: calendarLocale,
        format: "YYYY/MM/DD",
      });
    }
    return null;
  };

  const startDateObj = parseMonthYear(startValue);
  const endDateObj = parseMonthYear(endValue);

  return (
    <div className="w-full flex flex-row gap-3">
      {/* Start Date */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-medium text-muted-foreground">
          {startLabel}
        </label>
        <DatePicker
          value={startDateObj}
          onChange={(dateObj) => {
            if (dateObj) {
              const formatted = `${dateObj.year}/${String(
                dateObj.month.number
              ).padStart(2, "0")}`;
              onStartChange(formatted);
            } else {
              onStartChange("");
            }
          }}
          onlyMonthPicker
          format="MMMM YYYY"
          calendar={calendar}
          locale={calendarLocale}
          disabled={disabled}
          className={theme === "dark" ? "bg-dark text-white black" : "bg-white"}
          render={(value, openCalendar) => (
            <input
              type="text"
              readOnly
              value={value}
              onClick={openCalendar}
              disabled={disabled}
              placeholder={startPlaceholder}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "cursor-pointer"
              )}
            />
          )}
        />
        {error?.start && (
          <p className="text-red-600 text-xs mt-1">{error.start}</p>
        )}
      </div>

      {/* End Date */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-medium text-muted-foreground">
          {endLabel}
        </label>
        <DatePicker
          value={endDateObj}
          onChange={(dateObj) => {
            if (dateObj) {
              const formatted = `${dateObj.year}/${String(
                dateObj.month.number
              ).padStart(2, "0")}`;
              onEndChange(formatted);
            } else {
              onEndChange("");
            }
          }}
          onlyMonthPicker
          format="MMMM YYYY"
          calendar={calendar}
          locale={calendarLocale}
          disabled={disabled}
          className={theme === "dark" ? "bg-dark text-white black" : "bg-white"}
          render={(value, openCalendar) => (
            <input
              type="text"
              readOnly
              value={value}
              onClick={openCalendar}
              disabled={disabled}
              placeholder={endPlaceholder}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "cursor-pointer"
              )}
            />
          )}
        />
        {error?.end && <p className="text-red-600 text-xs mt-1">{error.end}</p>}
      </div>
    </div>
  );
};
