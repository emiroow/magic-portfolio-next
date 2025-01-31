import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");
  return <h1 className="text-red-500">{t("title")}</h1>;
}
