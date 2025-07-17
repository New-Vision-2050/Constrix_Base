import React from 'react';
import { Tooltip } from 'react-leaflet';
import { AttendanceRecord } from '../../constants/static-data';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

// Theme colors as constants for better maintainability
const COLORS = {
  DARK: {
    TOOLTIP_BG: '#8785A2',
  },
  LIGHT: {
    TOOLTIP_BG: '#E8E9F3',
  }
};

interface EmployeeTooltipProps {
  employee: AttendanceRecord;
}

const EmployeeTooltip: React.FC<EmployeeTooltipProps> = ({ employee }) => {
  const t = useTranslations('AttendanceDepartureModule.Map.tooltip');
  
  // Get current theme using resolvedTheme directly
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  // Theme specific colors using constants
  const tooltipBg = isDarkMode ? COLORS.DARK.TOOLTIP_BG : COLORS.LIGHT.TOOLTIP_BG;
  const tooltipTextColor = isDarkMode ? "text-white" : "text-gray-700";
  const borderColor = isDarkMode ? "border-gray-500/50" : "border-gray-300";
  return (
    <Tooltip
      direction="right"
      offset={[190, -21]}
      className="transparent-tooltip"
    >
      <div
        className={`${tooltipTextColor} p-3 rounded-lg shadow-lg font-sans w-auto ${isDarkMode ? 'dark-text-shadow' : ''}`}
        style={{ 
          backgroundColor: tooltipBg
        }}
      >
        <p>
          <span className={`font-bold ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>{t('employee')}</span> {employee.name}
        </p>
        <p className="mt-1">
          <span className={`font-bold ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>{t('branch')}</span> {employee.branch}
        </p>
        <p className="mt-1">
          <span className={`font-bold ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>{t('department')}</span>{" "}
          {employee.department}
        </p>
        <div className={`mt-3 pt-2 border-t ${borderColor}`}>
          <div className="flex justify-between items-center">
            <span className={`font-bold ${isDarkMode ? 'text-black' : 'text-gray-900'}`}>
              {t('lastSeen')}
            </span>
            <time className="font-mono text-sm" dateTime={employee.date}>
              {employee.date}
            </time>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

// Add CSS for text shadow
const styles = `
  .dark-text-shadow {
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
`;

// Create style element only once when component is imported
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default EmployeeTooltip;
