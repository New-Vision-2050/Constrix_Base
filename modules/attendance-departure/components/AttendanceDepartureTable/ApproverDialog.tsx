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
import { convertTo12HourFormat } from "../../utils/time-helpers";

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
  const { isApproverDialogOpen, selectedApproverRecord, closeApproverDialog } =
    useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table.dialogs.approver");

  // Get current theme using resolvedTheme
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Theme specific colors
  const accentColor = isDarkMode ? "#E91E63" : "#D81B60";
  const containerBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";

  // constraint name
  const constraintName =
    selectedApproverRecord?.professional_data?.attendance_constraint
      ?.constraint_name ?? UN_SPECIFIED;

  const constraintType =
    selectedApproverRecord?.professional_data?.attendance_constraint
      ?.constraint_type ?? UN_SPECIFIED;
      
  // Calculate total working hours across all days
  const calculateTotalWorkingHours = (): number => {
    if (!selectedApproverRecord?.professional_data?.attendance_constraint
        ?.constraint_config?.time_rules?.weekly_schedule) {
      return 0;
    }
    
    const weeklySchedule = selectedApproverRecord.professional_data.attendance_constraint
      .constraint_config.time_rules.weekly_schedule;
    
    let totalHours = 0;
    
    // Sum up hours from all days
    Object.values(weeklySchedule).forEach(dayData => {
      if (dayData.enabled && dayData.total_work_hours) {
        totalHours += dayData.total_work_hours;
      }
    });
    
    return parseFloat(totalHours.toFixed(2)); // Round to 2 decimal places
  };
  
  const totalWorkHours = calculateTotalWorkingHours();

  // get work day periods
  const getWorkDayPeriods = (periods: InputPeriodType[]): PeriodType[] => {
    return periods.map((period, index) => {
      // Use helper function for time conversion
      const startFormat = convertTo12HourFormat(period.start_time);
      const endFormat = convertTo12HourFormat(period.end_time);

      const start12Hour = startFormat.hour;
      const startPeriod = startFormat.period;
      const end12Hour = endFormat.hour;
      const endPeriod = endFormat.period;

      return {
        id: index + 1,
        label: `${t("period")} ${index + 1}`,
        fromValue: start12Hour.toString(),
        fromPeriod: startPeriod,
        toValue: end12Hour.toString(),
        toPeriod: endPeriod,
      };
    });
  };

  if (!selectedApproverRecord) return null;

  return (
    <DialogContainer
      isOpen={isApproverDialogOpen}
      onClose={closeApproverDialog}
      title={t("title")}
    >
      {/* Employee Information */}
      <EmployeeInfoSection record={selectedApproverRecord} />

      {/* Data Input Fields */}
      <div className={`flex flex-col gap-4 ${textColor}`}>
        <DisplayField
          label={t("approverName")}
          value={constraintName}
          defaultValue={t("unspecified")}
        />

        <DisplayField label={t("approverSystem")} value={constraintType} />

        {/* Workday Periods */}
        {selectedApproverRecord?.professional_data?.attendance_constraint
          ?.constraint_config?.time_rules?.weekly_schedule &&
          Object.entries(
            selectedApproverRecord?.professional_data?.attendance_constraint?.constraint_config?.time_rules?.weekly_schedule
          ).map(([day, dayData]) => {
            // Skip days that aren't enabled
            if (
              !dayData.enabled ||
              !dayData.periods ||
              dayData.periods.length === 0
            )
              return null;

            return (
              <WorkdayPeriods
                key={day}
                hours={dayData.total_work_hours}
                title={t(`days.${day}`)}
                periods={getWorkDayPeriods(dayData.periods ?? [])}
              />
            );
          })}
        {!selectedApproverRecord?.professional_data?.attendance_constraint
          ?.constraint_config?.time_rules?.weekly_schedule && (
          <WorkdayPeriods
            title={t("noWeeklySchedule")}
            periods={[]}
            hours={0}
          />
        )}

        <div className="text-xs text-left" style={{ color: accentColor }}>
          {t("workHours")} {totalWorkHours}
        </div>
      </div>
    </DialogContainer>
  );
};

export default ApproverDialog;
