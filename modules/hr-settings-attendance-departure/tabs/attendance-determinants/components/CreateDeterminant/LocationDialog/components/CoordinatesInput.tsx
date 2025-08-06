import React from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

interface CoordinatesInputProps {
  longitude: string;
  latitude: string;
  radius: string;
  onLongitudeChange: (value: string) => void;
  onLatitudeChange: (value: string) => void;
  onRadiusChange: (value: string) => void;
  disabled?: boolean;
}

export default function CoordinatesInput({
  longitude,
  latitude,
  radius,
  onLongitudeChange,
  onLatitudeChange,
  onRadiusChange,
  disabled = false,
}: CoordinatesInputProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations("location");
  
  
  // Common input classes
  const inputClasses = "w-full px-3 py-2 rounded-lg border focus:border-pink-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-gray-700 dark:text-white text-sm mb-2">{t("longitude")}:</label>
        <input
          type="number"
          value={longitude}
          onChange={(e) => onLongitudeChange(e.target.value)}
          className={inputClasses}
          placeholder="46.6753"
          disabled={disabled}
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-white text-sm mb-2">{t("latitude")}:</label>
        <input
          type="number"
          value={latitude}
          onChange={(e) => onLatitudeChange(e.target.value)}
          className={inputClasses}
          placeholder="24.7136"
          disabled={disabled}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-gray-700 dark:text-white text-sm mb-2">{t("radius")} ({t("meters")}):</label>
        <input
          type="number"
          value={parseInt(radius || '0', 10) || 0}
          onChange={(e) => onRadiusChange(e.target.value)}
          className={inputClasses}
          placeholder="1000"
          min="0"
        />
      </div>
    </div>
  );
}
