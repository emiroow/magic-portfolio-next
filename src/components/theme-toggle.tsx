"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const local = useLocale();
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="px-2"
      onClick={() => (local === "fa" ? router.push("/en") : router.push("/fa"))}
    >
      <span className="font-bold">{local === "fa" ? "EN" : "FA"}</span>
    </Button>
  );
};

export default ThemeToggle;
