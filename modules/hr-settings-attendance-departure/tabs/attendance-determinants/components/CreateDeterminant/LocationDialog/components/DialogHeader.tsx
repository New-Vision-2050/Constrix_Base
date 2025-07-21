import React from "react";
import { X } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

interface DialogHeaderProps {
  onClose: () => void;
}

export default function DialogHeader({ onClose }: DialogHeaderProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations("location");
  return (
    <div className="relative mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
        {t("chooseLocationCoordinates")}
      </h2>
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
}
