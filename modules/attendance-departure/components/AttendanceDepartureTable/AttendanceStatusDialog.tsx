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
  
  // No need to manually determine theme colors when using Tailwind's dark mode

  if (!selectedAttendanceRecord) return null;

  return (
    <DialogContainer 
      isOpen={isAttendanceStatusDialogOpen} 
      onClose={closeAttendanceStatusDialog}
      title={t("title")}
    >
      {/* Dialog content with theme-aware styling using Tailwind's dark mode */}
      <div className="flex flex-col gap-4 text-gray-800 dark:text-white">
        {/* Employee Information */}
        <EmployeeInfoSection record={selectedAttendanceRecord} />
        
        {/* Attendance Time Box */}
        <TimeBox 
          label={t("attendance")} 
          time={selectedAttendanceRecord.clock_in_time} 
          defaultTime="-" 
        />
        
        {/* Departure Time Box */}
        <TimeBox 
          label={t("departure")} 
          time={selectedAttendanceRecord.clock_out_time} 
          defaultTime="-" 
        />
      </div>
    </DialogContainer>
  );
};

export default AttendanceStatusDialog;
