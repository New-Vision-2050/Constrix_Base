import { useTranslations } from "next-intl";

export default function LoadingCase() {
  const t = useTranslations("companyProfile.officialDocs.docsSettingsDialog");
  
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">
        {t("notifyLoadingCase")}
      </p>
    </div>
  );
}
