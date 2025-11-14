"use client";
import { Link, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import React from "react";

type ThemeToggleProps = Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href"
>;

const ThemeToggle = React.forwardRef<HTMLAnchorElement, ThemeToggleProps>(
  (props, ref) => {
    const { locale } = useParams();
    const pathName = usePathname();
    const targetLocale = locale === "fa" ? "en" : "fa";

    // Remove the current locale from the pathname
    const pathWithoutLocale = pathName.replace(/^\/(fa|en)/, "");

    const url = `${pathWithoutLocale === "" ? "/" : pathWithoutLocale}`;

    return (
      <Link
        ref={ref}
        {...props}
        className="text-sm"
        href={url}
        locale={targetLocale}
      >
        {targetLocale.toUpperCase()}
      </Link>
    );
  }
);

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
