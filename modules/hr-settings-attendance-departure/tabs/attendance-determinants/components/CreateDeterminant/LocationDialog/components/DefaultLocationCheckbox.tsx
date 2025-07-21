import React from "react";
import { useTheme } from "next-themes";

interface DefaultLocationCheckboxProps {
  isDefaultLocation: boolean;
  onChange: (isDefault: boolean) => void;
}

export default function DefaultLocationCheckbox({
  isDefaultLocation,
  onChange,
}: DefaultLocationCheckboxProps) {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific colors
  const labelColor = isDarkMode ? 'text-white' : 'text-gray-700';
  const checkboxBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const checkboxBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  return (
    <div className="mb-6 flex justify-center">
      <label className={`flex items-center ${labelColor} cursor-pointer`}>
        <input
          type="checkbox"
          checked={isDefaultLocation}
          onChange={(e) => onChange(e.target.checked)}
          className={`mr-2 w-4 h-4 text-pink-500 ${checkboxBg} ${checkboxBorder} rounded focus:ring-pink-500 focus:ring-2`}
        />
        <span className="text-sm">موقع الفرع الافتراضي</span>
      </label>
    </div>
  );
}
