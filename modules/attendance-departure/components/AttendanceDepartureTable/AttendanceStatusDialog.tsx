"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import DialogContainer from "../shared/DialogContainer";
import EmployeeInfoSection from "../shared/EmployeeInfoSection";
import TimeBox from "../shared/TimeBox";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

/**
 * Attendance status dialog component that appears when clicking on the attendance status cell in the table
 */
const AttendanceStatusDialog: React.FC = () => {
  const {
    isAttendanceStatusDialogOpen,
    selectedAttendanceRecord,
    closeAttendanceStatusDialog,
  } = useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table.dialogs.attendanceStatus");
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const containerBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";

  if (!selectedAttendanceRecord) return null;

  return (
    <DialogContainer 
      isOpen={isAttendanceStatusDialogOpen} 
      onClose={closeAttendanceStatusDialog}
      title={t("title")}
    >
      {/* Dialog content with theme-aware styling */}
      <div className={`flex flex-col gap-4 ${textColor}`}>
        {/* Employee Information */}
        <EmployeeInfoSection record={selectedAttendanceRecord} />
        
        {/* Attendance Time Box */}
        <TimeBox 
          label={t("attendance")} 
          time={selectedAttendanceRecord.clock_in_time} 
          defaultTime="8:12 صباحاً" 
        />
        
        {/* Departure Time Box */}
        <TimeBox 
          label={t("departure")} 
          time={selectedAttendanceRecord.clock_out_time} 
          defaultTime="5:30 مساءاً" 
        />
      </div>
    </DialogContainer>
  );
};

export default AttendanceStatusDialog;
