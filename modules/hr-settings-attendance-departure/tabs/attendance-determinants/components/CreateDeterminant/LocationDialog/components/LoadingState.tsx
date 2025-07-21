import React from "react";
import { useTheme } from "next-themes";

export default function LoadingState() {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific colors
  const textColor = isDarkMode ? 'text-white' : 'text-gray-700';
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
      <span className={`${textColor} text-sm`}>جاري التحميل...</span>
    </div>
  );
}
