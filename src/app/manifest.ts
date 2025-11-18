import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const NAME = process.env.NEXT_PUBLIC_SITE_TITLE || "Portfolio";
  const DESCRIPTION =
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Personal portfolio website";
  return {
    name: NAME,
    short_name: NAME,
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
