import React from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

// Checkbox styling as a utility class for better maintainability
const checkboxStyles = "w-4 h-4 mr-2 text-pink-500 rounded focus:ring-pink-500 focus:ring-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600";

interface DefaultLocationCheckboxProps {
  isDefaultLocation: boolean;
  onChange: (isDefault: boolean) => void;
}

export default function DefaultLocationCheckbox({
  isDefaultLocation,
  onChange,
}: DefaultLocationCheckboxProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations("location");
  return (
    <div className="mb-6 flex justify-center cursor-pointer">
      <label className="flex items-center text-gray-700 dark:text-white">
        <input
          type="checkbox"
          checked={isDefaultLocation}
          onChange={(e) => onChange(e.target.checked)}
          className={checkboxStyles}
        />
        <span className="text-sm">{t("defaultBranchLocation")}</span>
      </label>
    </div>
  );
}
