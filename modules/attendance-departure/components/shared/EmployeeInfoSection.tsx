"use client";

import React from "react";
import { AttendanceStatusRecord } from "../../types/attendance";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

interface EmployeeInfoSectionProps {
  record: AttendanceStatusRecord | null;
}


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
  if (record?.is_late==1) {
    _status = "late";
  } else if (
    record?.is_absent===1
  ) {
    _status = "absent";
  } else if (
    record?.is_holiday===1
  ) {
    _status = "holiday";
  } else if (
    record?.status==="completed"||record?.status==="active"&&(record?.is_absent&&record?.is_holiday&&record?.is_late) 
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
    if (!record?.is_late) {
      return "text-green-500";
    } else if (record?.is_late) {
      return "text-yellow-400";
    } else {
      return "text-red-500";
    }
  };

  return (
    <>
      <div className="flex  justify-between items-center text-sm gap-2">
        <div className={textColor}>{t("branch")} : {record?.professional_data?.branch??"-"}</div>
        <div className={textColor}>{t("jobId")} : {record?.professional_data?.job_code??"-"}</div>
        <div className={textColor}>{t("department")} : {record?.professional_data?.management??"-"}</div>
        <div className={textColor}>
          {t("approver")} : {record?.professional_data?.attendance_constraint?.constraint_name??"-"}
        </div>
        <div className={textColor}>
          {t("attendanceStatus")} : 
          <span className={`font-bold ${color} mx-1`}>
            {text??"-"}
          </span>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfoSection;
