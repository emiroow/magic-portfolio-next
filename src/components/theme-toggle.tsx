"use client";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ThemeToggle = () => {
  const local = useLocale();
  const router = useRouter();
  return (
    <Link className="text-sm font-bold" href={local === "fa" ? "/en" : "/fa"}>
      {local === "fa" ? "En" : "Fa"}
    </Link>
  );
};

export default ThemeToggle;
