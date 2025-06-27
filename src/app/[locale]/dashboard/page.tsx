import { ModeToggle } from "@/components/mode-toggle";
import ThemeToggle from "@/components/theme-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("dashboard.menu");
  return (
    <main className="flex justify-center flex-col">
      <div className="w-full">
        <ModeToggle />
        <ThemeToggle />
      </div>
      <Tabs
        defaultValue="Profile"
        className="w-full flex flex-col m-auto justify-center items-center"
      >
        <TabsList className="flex mb-5">
          <TabsTrigger value="Profile">{t("Profile")}</TabsTrigger>
          <TabsTrigger value="Work">{t("Work")}</TabsTrigger>
          <TabsTrigger value="Education">{t("Education")}</TabsTrigger>
          <TabsTrigger value="Skills">{t("Skills")}</TabsTrigger>
          <TabsTrigger value="Projects">{t("Projects")}</TabsTrigger>
        </TabsList>
        <TabsContent value="Profile" className="w-full bg-red-600">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </main>
  );
};

export default page;
