"use client";

import React from "react";
import DialogContainer from "../../components/shared/DialogContainer";
import DisplayField from "../../components/shared/DisplayField";
import EmployeeInfoSection from "../../components/shared/EmployeeInfoSection";
import WorkdayPeriods, {
  PeriodType,
} from "../../components/shared/WorkdayPeriods";
import { useAttendance } from "../../context/AttendanceContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { UN_SPECIFIED } from "../../constants/static-data";
import { convertTo12HourFormat, formatDateTime } from "../../utils/time-helpers";
import Loader from "@/components/shared/loader/Loader";

// Define the input period type structure
interface InputPeriodType {
  start_time: string;
  end_time: string;
  [key: string]: any; // Allow for any additional properties
}

/**
 * Approver dialog component that appears when clicking on the approver cell in the table
 */
const ApproverDialog: React.FC = () => {
  const { isApproverDialogOpen, attendanceHistory, attendanceHistoryLoading, closeApproverDialog } =
    useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table.dialogs.approver");

  // Get current theme using resolvedTheme
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Theme specific colors

  const textColor = isDarkMode ? "text-white" : "text-gray-800";



  if (!attendanceHistory) return null;

  return (
    <DialogContainer
      isOpen={isApproverDialogOpen}
      onClose={closeApproverDialog}
      title={t("title")}
      >
        {
          attendanceHistoryLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader />
            </div>
          ) : (
            <>
              <EmployeeInfoSection record={attendanceHistory[0]} />
              {
                attendanceHistory.map((record, index) => (
                <div key={`attendance-record-${record.id || record.user_id || index}`} className="flex flex-col gap-4">                  <div className={`flex flex-col gap-4 ${textColor}`}>
                    <DisplayField
                      label={t("DateOfAttendance")} 
                      value={formatDateTime(record.clock_in_time) || t("unspecified")}
                    />
                    <DisplayField label={t("DateOfDeparture")} value={formatDateTime(record.clock_out_time) || t("unspecified")} />
                  </div>
                </div>
                ))
              }
            </>
          )
        }
      
     
    </DialogContainer>
  );
};

export default ApproverDialog;
