import React from "react";
import { X } from "lucide-react";
import { useTheme } from "next-themes";

interface DialogHeaderProps {
  onClose: () => void;
}

export default function DialogHeader({ onClose }: DialogHeaderProps) {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific colors
  const titleColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const closeButtonColor = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900';
  return (
    <div className="relative mb-6">
      <h2 className={`text-xl font-bold ${titleColor} text-center`}>
        اختر إحداثيات الموقع
      </h2>
      <button
        onClick={onClose}
        className={`absolute top-0 right-0 ${closeButtonColor} transition-colors`}
      >
        <X size={24} />
      </button>
    </div>
  );
}
