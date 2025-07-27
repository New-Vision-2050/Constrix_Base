"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import DialogContainer from "../shared/DialogContainer";
import EmployeeInfoSection from "../shared/EmployeeInfoSection";
import WorkdayPeriods from "../shared/WorkdayPeriods";
import { useTranslations } from "next-intl";
import { convertToPeriodType } from "../../utils/periods-helper";
import { DUMMY_WORK_PERIODS } from "../../constants/dummy-data";

/**
 * Attendance status dialog component that appears when clicking on the attendance status cell in the table
 * Displays employee information, work periods schedule and actual attendance records
 */
const AttendanceStatusDialog: React.FC = () => {
  const {
    isAttendanceStatusDialogOpen,
    selectedAttendanceRecord,
    closeAttendanceStatusDialog,
  } = useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table.dialogs.attendanceStatus");
  
  // Dummy data for actual and deducted hours
  const dummyActualHours = [3.5, 3.75]; // Actual hours worked for each period
  const dummyDeductedHours = [0.5, 0.25]; // Hours deducted from each period
  
  // Get work periods using helper function with translation support and hours information
  const periodsList = convertToPeriodType(DUMMY_WORK_PERIODS, t, dummyActualHours, dummyDeductedHours);
  
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
        
        {/* Attendance Periods */}
        <WorkdayPeriods
          title={t("todaySchedule")}
          periods={periodsList}
          hours={8}
          readOnly={true}
        />
        
        {/* Actual attendance record - we can keep this for reference */}
        <div className="mt-2 bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
          <div className="text-sm font-medium mb-2">{t("actualRecords")}</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t("attendance")}</span>
              <div className="font-medium">{selectedAttendanceRecord.clock_in_time ?? '-'}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t("departure")}</span>
              <div className="font-medium">{selectedAttendanceRecord.clock_out_time ?? '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </DialogContainer>
  );
};

export default AttendanceStatusDialog;
