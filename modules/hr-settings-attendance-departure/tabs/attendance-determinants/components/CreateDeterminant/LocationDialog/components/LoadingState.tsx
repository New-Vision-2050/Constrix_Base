import React from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export default function LoadingState() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations("location");
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
      <span className="text-gray-700 dark:text-white text-sm">{t("loading")}</span>
    </div>
  );
}
