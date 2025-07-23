"use client";

import React from "react";
import { AttendanceStatusRecord } from "../../types/attendance";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

interface EmployeeInfoSectionProps {
  record: AttendanceStatusRecord;
}

/**
 * Shared component for displaying employee information in different dialogs
 */
const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({
  record,
}) => {
  const t = useTranslations("AttendanceDepartureModule.shared.EmployeeInfoSection");
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  // Determine the color for attendance status
  const getStatusColor = () => {
    if (record.is_late === 0) {
      return "text-green-500";
    } else if (record.is_late === 1) {
      return "text-yellow-400";
    } else {
      return "text-red-500";
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center text-sm gap-3">
        <div className={textColor}>{t("branch")}: {record.company.name}</div>
        <div className={textColor}>{t("jobId")}: emp-101</div>
        <div className={textColor}>{t("department")}: {record.company.name}</div>
        <div className={textColor}>
          {t("approver")}: {record?.professional_data?.attendance_constraint?.constraint_name || t("unspecified")}
        </div>
        <div className={textColor}>
          {t("attendanceStatus")}:
          <span className={`font-bold ${getStatusColor()}`}>
            {record.is_late === 0 ? t("status.present") : record.is_late === 1 ? t("status.late") : t("status.absent")}
          </span>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfoSection;
