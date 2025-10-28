"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface LanguageTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  arabicContent: ReactNode;
  englishContent: ReactNode;
  className?: string;
}

export default function LanguageTabs({
  activeTab,
  onTabChange,
  arabicContent,
  englishContent,
  className = "",
}: LanguageTabsProps) {
  const t = useTranslations();

  return (
    <div className={`w-full ${className}`}>
      {/* Language Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => onTabChange("ar")}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeTab === "ar"
              ? "text-white border-primary border-b-2"
              : "hover:text-white"
          }`}
        >
          {t("labels.arabicLanguage") || "اللغة العربية (AR)"}
        </button>
        <button
          type="button"
          onClick={() => onTabChange("en")}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeTab === "en"
              ? "text-white border-primary border-b-2"
              : "hover:text-white"
          }`}
        >
          {t("labels.englishLanguage") || "اللغة الإنجليزية (EN)"}
        </button>
      </div>

      {/* Arabic Content */}
      {activeTab === "ar" && <div className="space-y-4">{arabicContent}</div>}

      {/* English Content */}
      {activeTab === "en" && <div className="space-y-4">{englishContent}</div>}
    </div>
  );
}
