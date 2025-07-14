import React from "react";
import { useTheme } from "next-themes";

export default function NoDataState() {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific colors
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="px-6 py-4 rounded-lg text-center">
        <p className={`text-sm font-medium ${textColor}`}>قم بتحديد الفروع أولاً</p>
        <p className={`text-xs mt-1 ${subTextColor}`}>يجب اختيار الفروع من النموذج أولاً لتتمكن من تحديد مواقعها</p>
      </div>
    </div>
  );
}
