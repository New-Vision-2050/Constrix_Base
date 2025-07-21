import React from 'react';
import { Tooltip } from 'react-leaflet';
import { AttendanceRecord } from '../../constants/static-data';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

interface EmployeeTooltipProps {
  employee: AttendanceRecord;
}

const EmployeeTooltip: React.FC<EmployeeTooltipProps> = ({ employee }) => {
  const t = useTranslations('AttendanceDepartureModule.Map.tooltip');
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const tooltipBg = isDarkMode ? "#8785A2" : "#E8E9F3";
  const tooltipTextColor = isDarkMode ? "text-white" : "text-gray-700";
  const labelTextColor = isDarkMode ? "text-black" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-500/50" : "border-gray-300";
  return (
    <Tooltip
      direction="right"
      offset={[190, -21]}
      className="transparent-tooltip"
    >
      <div
        className={`${tooltipTextColor} p-3 rounded-lg shadow-lg font-sans w-auto`}
        style={{ 
          backgroundColor: tooltipBg, 
          textShadow: isDarkMode ? "0 1px 3px rgba(0,0,0,0.4)" : "none" 
        }}
      >
        <p>
          <span className={`font-bold ${labelTextColor}`}>{t('employee')}</span> {employee.name}
        </p>
        <p className="mt-1">
          <span className={`font-bold ${labelTextColor}`}>{t('branch')}</span> {employee.branch}
        </p>
        <p className="mt-1">
          <span className={`font-bold ${labelTextColor}`}>{t('department')}</span>{" "}
          {employee.department}
        </p>
        <div className={`mt-3 pt-2 border-t ${borderColor}`}>
          <div className="flex justify-between items-center">
            <span className={`font-bold ${labelTextColor}`}>
              {t('lastSeen')}
            </span>
            <span className="font-mono text-sm">
              {employee.date}
            </span>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default EmployeeTooltip;
