import React from "react";
import DeterminantItem from "./DeterminantItem/DeterminantItem";
import { MapPin } from "lucide-react";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { useAttendanceDeterminants } from "../../context/AttendanceDeterminantsContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

interface DeterminantsListProps {
  determinants: Constraint[];
  onClick: (id: string) => void;
}

/**
 * Component to display a list of attendance determinants
 * Puede recibir props directamente o usar el contexto
 */
const DeterminantsList: React.FC<DeterminantsListProps> = ({
  determinants,
  onClick,
}) => {
  const { activeConstraint } = useAttendanceDeterminants();
  const isActive = !Boolean(activeConstraint);
  // استخدام hook الترجمة للوصول إلى مفاتيح الترجمة
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantsList");
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const containerBg = isDarkMode ? 'bg-[#1A103C]' : 'bg-white';
  const itemHoverBg = isDarkMode ? 'hover:bg-[#2A204C]' : 'hover:bg-gray-50';
  const activeBorderColor = isDarkMode ? 'border-purple-800/30' : 'border-gray-200';
  const activeTextColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inactiveTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${containerBg} rounded-lg overflow-hidden mx-auto shadow-sm border ${isDarkMode ? 'border-purple-900/20' : 'border-gray-200'}`}>
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b ${activeBorderColor} cursor-pointer ${itemHoverBg} transition-colors`}
        onClick={() => onClick("all-determinants")}
      >
        <MapPin size={16} className={`${isActive ? activeTextColor : inactiveTextColor}`} />
        <div className={`${isActive ? activeTextColor : inactiveTextColor} text-sm font-medium`}>{t('allDeterminants')}</div>
      </div>
      <div className="px-4">
        {determinants.map((determinant) => (
          <DeterminantItem
            key={determinant.id}
            determinant={determinant}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default DeterminantsList;
