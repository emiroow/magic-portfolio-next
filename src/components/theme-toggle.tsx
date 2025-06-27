"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const ThemeToggle = () => {
  const { locale } = useParams();
  const pathName = usePathname();
  const targetLocale = locale === "fa" ? "en" : "fa";
  // Remove the current locale from the pathname
  const pathWithoutLocale = pathName.replace(/^\/(fa|en)/, "");

  const url = `/${targetLocale}${
    pathWithoutLocale === "" ? "/" : pathWithoutLocale
  }`;

  return (
    <Link className="text-sm" href={url}>
      {targetLocale.toUpperCase()}
    </Link>
  );
};

export default ThemeToggle;
