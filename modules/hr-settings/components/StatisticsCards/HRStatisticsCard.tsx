import React from "react";
import { useTheme } from "next-themes";

interface StatisticsCardProps {
  label: string;
  value: number | string;
  percentage?: number;
  icon: React.ReactNode;
  percentageColor?: string;
  backgroundColor?: string;
  iconBgColor?: string;
}

/**
 * Individual statistics card component for HR settings
 */
const HRStatisticsCard: React.FC<StatisticsCardProps> = ({
  label,
  value,
  percentage,
  icon,
  percentageColor = "#27C200",
  backgroundColor,
  iconBgColor,
}) => {
  // Get current theme from next-themes
  const { theme, systemTheme } = useTheme();
  
  // Determine if the current mode is dark
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Set default colors based on theme
  const defaultBgColor = isDarkMode ? "#18123A" : "#f0f4f8";
  const defaultIconBgColor = isDarkMode ? "#2C254B" : "#e2e8f0";
  
  // Use provided colors or defaults based on theme
  const bgColor = backgroundColor || defaultBgColor;
  const iconBg = iconBgColor || defaultIconBgColor;
  
  // Text color based on theme
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  return (
    <div
      style={{ background: bgColor }}
      className={`flex items-center justify-between rounded-xl p-4 min-w-[270px] min-h-[110px] ${textColor}`}
      dir="rtl"
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-lg ml-4"
        style={{ background: iconBg, width: 40, height: 40 }}
      >
        {icon}
      </div>

      {/* Label and value */}
      <div className="flex flex-col justify-center flex-1">
        <div className={`text-lg mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontWeight: 400 }}>
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-normal ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{value}</span>
          {percentage !== undefined && (
            <span
              className="text-sm font-normal"
              style={{ color: percentageColor }}
            >
              ({percentage}%)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRStatisticsCard;
