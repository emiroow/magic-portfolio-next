"use client";
import dynamic from "next/dynamic";

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
};

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  height = 400,
}: MarkdownEditorProps) {
  // Respect theme via data-color-mode attribute (next-themes sets class on html)
  // @uiw reads prefers-color-scheme, but we ensure dark looks good by inheriting.
  return (
    <div data-color-mode="auto" className={className}>
      <MDEditor
        value={value}
        onChange={(val: string | undefined) => onChange(val || "")}
        height={height}
        previewOptions={
          {
            // Allow code blocks to render nicely; users can add ```lang fences
          }
        }
        textareaProps={{ placeholder }}
      />
    </div>
  );
}
