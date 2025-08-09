import BlurFadeText from "@/components/magicui/blur-fade-text";
import Tab from "@/components/ui/tab";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("dashboard");
  return (
    <main className="w-full flex justify-center flex-col relative">
      <BlurFadeText
        className="text-center text-5xl font-bold m-auto mt-10"
        text={t("title")}
        delay={0.04}
        yOffset={20}
      />
      <Tab />
    </main>
  );
};

export default page;
