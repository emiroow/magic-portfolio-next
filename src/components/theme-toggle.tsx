"use client";
import { Link, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";

const ThemeToggle = () => {
  const { locale } = useParams();
  const pathName = usePathname();
  const targetLocale = locale === "fa" ? "en" : "fa";
  // Remove the current locale from the pathname
  const pathWithoutLocale = pathName.replace(/^\/(fa|en)/, "");

  const url = `${pathWithoutLocale === "" ? "/" : pathWithoutLocale}`;

  return (
    <Link className="text-sm" href={url} locale={targetLocale}>
      {targetLocale.toUpperCase()}
    </Link>
  );
};

export default ThemeToggle;
