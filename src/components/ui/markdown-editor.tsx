"use client";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Styles for the editor & preview
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";

// Load editor on client only to avoid SSR issues
const MDEditor = dynamic<any>(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

type MarkdownEditorProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
  label?: string;
  required?: boolean;
  error?: string | null;
  maxLength?: number;
  hideToolbar?: boolean;
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  height = 400,
  label,
  required,
  error,
  maxLength,
  hideToolbar,
}: MarkdownEditorProps) {
  const locale = useLocale();
  const dir = locale === "fa" ? "rtl" : "ltr";
  const { theme, resolvedTheme } = useTheme();

  const colorMode = useMemo<"light" | "dark">(() => {
    const current = theme === "system" ? resolvedTheme : theme;
    return current === "dark" ? "dark" : "light";
  }, [theme, resolvedTheme]);

  const fallbackPlaceholder = useMemo(
    () =>
      placeholder ??
      (locale === "fa"
        ? "محتوای خود را اینجا بنویسید..."
        : "Write your content here..."),
    [placeholder, locale]
  );

  const chars = value?.length ?? 0;
  const limitReached = typeof maxLength === "number" && chars > maxLength;

  return (
    <div className={cn("space-y-1", className)} dir={dir}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </label>
      )}

      <div
        data-color-mode={colorMode}
        className={cn(
          "rounded-md border",
          dir === "rtl" &&
            "[&_*]:text-right [&_.w-md-editor-toolbar]:justify-end"
        )}
      >
        <MDEditor
          value={value}
          onChange={(val: string | undefined) => onChange(val || "")}
          height={height}
          hideToolbar={hideToolbar}
          textareaProps={{ placeholder: fallbackPlaceholder, dir }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {error ? <span className="text-destructive">{error}</span> : <span />}
        {typeof maxLength === "number" && (
          <span className={cn(limitReached && "text-destructive")}>
            {locale === "fa"
              ? `کاراکتر: ${chars}/${maxLength}`
              : `Characters: ${chars}/${maxLength}`}
          </span>
        )}
      </div>
    </div>
  );
}
