import { ModeToggle } from "@/components/mode-toggle";
import ThemeToggle from "@/components/theme-toggle";
import Tab from "@/components/ui/tab";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("dashboard");
  return (
    <main className="w-full flex justify-center flex-col relative">
      <div className="w-full flex justify-between absolute top-0 items-center">
        <ThemeToggle />
        <ModeToggle />
      </div>
      <p className="text-center text-5xl font-bold">{t("title")}</p>
      <Tab />
    </main>
  );
};

export default page;
