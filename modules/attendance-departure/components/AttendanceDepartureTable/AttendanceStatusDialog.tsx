"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import DialogContainer from "../shared/DialogContainer";
import EmployeeInfoSection from "../shared/EmployeeInfoSection";
import TimeBox from "../shared/TimeBox";
import { useTranslations } from "next-intl";

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

  if (!selectedAttendanceRecord) return null;

  return (
    <DialogContainer 
      isOpen={isAttendanceStatusDialogOpen} 
      onClose={closeAttendanceStatusDialog}
      title={t("title")}
    >
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
    </DialogContainer>
  );
};

export default AttendanceStatusDialog;
