"use client";

type JsonLdProps = {
  item: Record<string, any>;
};

/**
 * Renders a JSON-LD script tag for structured data.
 * Ensure the `item` object complies with schema.org.
 */
export function JsonLd({ item }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // It's safe here because we control the content
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
    />
  );
}
