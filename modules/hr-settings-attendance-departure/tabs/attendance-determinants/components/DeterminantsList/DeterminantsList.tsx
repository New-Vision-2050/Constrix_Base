import React from "react";
import DeterminantItem from "./DeterminantItem/DeterminantItem";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
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
  const { activeConstraint, sidebarPage, sidebarTotalPages, handleSidebarPageChange } = useAttendanceDeterminants();
  const isActive = !Boolean(activeConstraint);
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantsList");
  
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  const containerBg = isDarkMode ? 'bg-[#1A103C]' : 'bg-white';
  const itemHoverBg = isDarkMode ? 'hover:bg-[#2A204C]' : 'hover:bg-gray-50';
  const activeBorderColor = isDarkMode ? 'border-purple-800/30' : 'border-gray-200';
  const activeTextColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const inactiveTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const paginationBg = isDarkMode ? 'bg-[#120d2b]' : 'bg-gray-50';
  const paginationText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const paginationBtnBase = `p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-purple-900/40 disabled:text-gray-600' : 'hover:bg-gray-200 disabled:text-gray-300'}`;

  return (
    <div className={`${containerBg} rounded-lg overflow-hidden shadow-sm border w-full flex flex-col ${isDarkMode ? 'border-purple-900/20' : 'border-gray-200'}`}>
      {/* "All determinants" header row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b ${activeBorderColor} cursor-pointer ${itemHoverBg} transition-colors flex-shrink-0`}
        onClick={() => onClick("all-determinants")}
      >
        <MapPin size={16} className={`${isActive ? activeTextColor : inactiveTextColor}`} />
        <div className={`${isActive ? activeTextColor : inactiveTextColor} text-sm font-medium`}>{t('allDeterminants')}</div>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto px-4" style={{ maxHeight: "calc(100vh - 280px)" }}>
        {determinants.map((determinant) => (
          <DeterminantItem
            key={determinant.id}
            determinant={determinant}
            onClick={onClick}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {sidebarTotalPages > 1 && (
        <div className={`flex items-center justify-between px-3 py-2 border-t ${activeBorderColor} ${paginationBg} flex-shrink-0`}>
          <button
            onClick={() => handleSidebarPageChange(sidebarPage - 1)}
            disabled={sidebarPage <= 1}
            className={paginationBtnBase}
            aria-label="Previous page"
          >
            <ChevronRight size={16} />
          </button>
          <span className={`text-xs ${paginationText}`}>
            {sidebarPage} / {sidebarTotalPages}
          </span>
          <button
            onClick={() => handleSidebarPageChange(sidebarPage + 1)}
            disabled={sidebarPage >= sidebarTotalPages}
            className={paginationBtnBase}
            aria-label="Next page"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DeterminantsList;
