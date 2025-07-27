import React from "react";
import DeterminantsList from "./DeterminantsList/DeterminantsList";
import { Constraint } from "../../../types/constraint-type";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

interface AttendanceDeterminantsContentProps {
  determinants: Constraint[];
  onDeterminantClick: (id: string) => void;
}

/**
 * Content component for the attendance determinants tab
 * يمكن أن يستقبل props مباشرة أو استخدام السياق
 */
const AttendanceDeterminantsContent: React.FC<
  AttendanceDeterminantsContentProps
> = ({ determinants, onDeterminantClick }) => {
  // استخدام دالة الترجمة
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants");

  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const containerBg = isDarkMode ? 'bg-gray-900/20' : 'bg-gray-50';
  return (
    <div className={`p-4 flex flex-col items-center gap-4 ${containerBg} rounded-md`}>
      {/* قائمة المحددات */}
      <DeterminantsList
        determinants={determinants}
        onClick={onDeterminantClick}
      />
    </div>
  );
};

export default AttendanceDeterminantsContent;
