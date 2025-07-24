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
  const statusT = useTranslations("attendanceDeparture.status");
  const t = useTranslations("AttendanceDepartureModule.shared.EmployeeInfoSection");
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';

  // employee attendance status
  let _status = "unspecified", text = "unspecified", color = "text-gray-400";
  if (record.is_absent) {
    _status = "absent";
  } else if (record.is_holiday) {
    _status = "holiday";
  } else if (record.is_late) {
    _status = "late";
  } else if (
    ['active', 'completed'].includes(record.status)
  ) {
    _status = "present";
  }

  // Map the backend status to display text
  switch (_status) {
    case "present":
      text = statusT("present");
      color = "text-green-500";
      break;
    case "absent":
      text = statusT("absent");
      color = "text-red-500";
      break;
    case "late":
      text = statusT("late");
      color = "text-yellow-400";
      break;
    case "holiday":
      text = statusT("holiday");
      color = "text-blue-500";
      break;
    default:
      text = statusT("unspecified");
      color = "text-gray-400";
      break;
  }
  
  // Theme specific colors
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  // Determine the color for attendance status
  const getStatusColor = () => {
    if (!record.is_late) {
      return "text-green-500";
    } else if (record.is_late) {
      return "text-yellow-400";
    } else {
      return "text-red-500";
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center text-sm gap-3">
        <div className={textColor}>{t("branch")}: {record.company?.name??"-"}</div>
        <div className={textColor}>{t("jobId")}: {record.professional_data?.job_code??"-"}</div>
        <div className={textColor}>{t("department")}: {record.company?.name??"-"}</div>
        <div className={textColor}>
          {t("approver")}: {record?.professional_data?.attendance_constraint?.constraint_name??"-"}
        </div>
        <div className={textColor}>
          {t("attendanceStatus")}:
          <span className={`font-bold ${color}`}>
            {text??"-"}
          </span>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfoSection;
