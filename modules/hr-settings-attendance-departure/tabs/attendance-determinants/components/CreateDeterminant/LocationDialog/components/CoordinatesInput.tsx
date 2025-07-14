import React from "react";
import { useTheme } from "next-themes";

interface CoordinatesInputProps {
  longitude: string;
  latitude: string;
  radius: string;
  onLongitudeChange: (value: string) => void;
  onLatitudeChange: (value: string) => void;
  onRadiusChange: (value: string) => void;
}

export default function CoordinatesInput({
  longitude,
  latitude,
  radius,
  onLongitudeChange,
  onLatitudeChange,
  onRadiusChange,
}: CoordinatesInputProps) {
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific colors
  const labelColor = isDarkMode ? 'text-white' : 'text-gray-700';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const inputText = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className={`block ${labelColor} text-sm mb-2`}>خط الطول:</label>
        <input
          type="text"
          value={longitude}
          onChange={(e) => onLongitudeChange(e.target.value)}
          className={`w-full px-3 py-2 ${inputBg} ${inputText} rounded-lg border ${inputBorder} focus:border-pink-500 focus:outline-none ${placeholderColor}`}
          placeholder="25.3253.486.4786.1"
        />
      </div>
      <div>
        <label className={`block ${labelColor} text-sm mb-2`}>خط العرض:</label>
        <input
          type="text"
          value={latitude}
          onChange={(e) => onLatitudeChange(e.target.value)}
          className={`w-full px-3 py-2 ${inputBg} ${inputText} rounded-lg border ${inputBorder} focus:border-pink-500 focus:outline-none ${placeholderColor}`}
          placeholder="25.3253.486.4786.1"
        />
      </div>
      <div className="col-span-2">
        <label className={`block ${labelColor} text-sm mb-2`}>مسافة الحضور (متر):</label>
        <input
          type="number"
          value={Number(radius??'0')}
          onChange={(e) => onRadiusChange(e.target.value)}
          className={`w-full px-3 py-2 ${inputBg} ${inputText} rounded-lg border ${inputBorder} focus:border-pink-500 focus:outline-none ${placeholderColor}`}
          placeholder="100"
          min="0"
        />
      </div>
    </div>
  );
}
