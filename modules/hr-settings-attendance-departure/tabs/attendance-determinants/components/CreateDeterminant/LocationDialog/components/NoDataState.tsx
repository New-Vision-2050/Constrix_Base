import React from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export default function NoDataState() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations("location");
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="px-6 py-4 rounded-lg text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{t("selectBranchesFirst")}</p>
        <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">{t("selectBranchesInstructions")}</p>
      </div>
    </div>
  );
}
