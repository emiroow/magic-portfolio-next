import Footer from "@/components/dashboard/footer";
import Tab from "@/components/dashboard/tab";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { useTranslations } from "next-intl";
const Page = () => {
  const t = useTranslations("dashboard");

  return (
    <main className="w-full flex justify-center flex-col relative">
      <BlurFadeText
        className="text-center text-5xl font-bold m-auto mt-14"
        text={t("title")}
        delay={0.04}
        yOffset={20}
      />
      <Tab />
      <Footer />
    </main>
  );
};

export default Page;
