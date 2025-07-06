"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import DialogContainer from "../shared/DialogContainer";
import EmployeeInfoSection from "../shared/EmployeeInfoSection";
import TimeBox from "../shared/TimeBox";

/**
 * Attendance status dialog component that appears when clicking on the attendance status cell in the table
 */
const AttendanceStatusDialog: React.FC = () => {
  const {
    isAttendanceStatusDialogOpen,
    selectedAttendanceRecord,
    closeAttendanceStatusDialog,
  } = useAttendance();

  if (!selectedAttendanceRecord) return null;

  return (
    <DialogContainer 
      isOpen={isAttendanceStatusDialogOpen} 
      onClose={closeAttendanceStatusDialog}
      title="حالة الحضور"
    >
      {/* Employee Information */}
      <EmployeeInfoSection record={selectedAttendanceRecord} />
      
      {/* Attendance Time Box */}
      <TimeBox 
        label="الحضور" 
        time={selectedAttendanceRecord.clock_in_time} 
        defaultTime="8:12 صباحاً" 
      />
      
      {/* Departure Time Box */}
      <TimeBox 
        label="الانصراف" 
        time={selectedAttendanceRecord.clock_out_time} 
        defaultTime="5:30 مساءاً" 
      />
    </DialogContainer>
  );
};

export default AttendanceStatusDialog;
