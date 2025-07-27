"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import DialogContainer from "../shared/DialogContainer";
import { useTranslations } from "next-intl";
import { convertToPeriodType } from "../../utils/periods-helper";
import { DUMMY_WORK_PERIODS } from "../../constants/dummy-data";
import DisplayField from "../shared/DisplayField";
import { Period } from "../../types/constraint";

/**
 * Attendance status dialog component that appears when clicking on the attendance status cell in the table
 * Displays employee information, work periods schedule and actual attendance records
 */
const AttendanceStatusDialog: React.FC = () => {
  const {
    isAttendanceStatusDialogOpen,
    closeAttendanceStatusDialog,
    constraintDetails,
  } = useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table.dialogs.attendanceStatus");
  
  // Dummy data for actual and deducted hours
  const dummyActualHours = [3.5, 3.75]; // Actual hours worked for each period
  const dummyDeductedHours = [0.5, 0.25]; // Hours deducted from each period
  
  // Get work periods using helper function with translation support and hours information
  const periodsList = convertToPeriodType(DUMMY_WORK_PERIODS, t, dummyActualHours, dummyDeductedHours);
  
  if (!constraintDetails) return null;

  return (
    <DialogContainer 
      isOpen={isAttendanceStatusDialogOpen} 
      onClose={closeAttendanceStatusDialog}
      title="بيانات محدد الحضور"
    >
      {/* Dialog content with theme-aware styling using Tailwind's dark mode */}
      <div className="flex flex-col gap-6 text-foreground bg-background p-6 rounded-lg border border-border">
        
        {/* Constraint Name and System */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <DisplayField label={"اسم المحدد"} value={constraintDetails?.constraint_name|| t("unspecified")} />
          <DisplayField label={"نظام المحدد"} value={constraintDetails?.constraint_type || t("unspecified")} />
        </div>

        {/* Weekly Schedule */}
        {constraintDetails?.config?.time_rules?.weekly_schedule && 
          Object.entries(constraintDetails.config.time_rules.weekly_schedule).map(([dayKey, dayData]) => {
            // Skip if day is not enabled or has no periods
            if (!dayData.enabled || !dayData.periods || dayData.periods.length === 0) {
              return null;
            }

            // Day names mapping
            const dayNames: Record<string, string> = {
              saturday: 'السبت',
              sunday: 'الأحد', 
              monday: 'الاثنين',
              tuesday: 'الثلاثاء',
              wednesday: 'الأربعاء',
              thursday: 'الخميس',
              friday: 'الجمعة'
            };

            return (
              <div key={dayKey} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {dayNames[dayKey] || dayKey}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    عدد الفترات: {dayData.periods.length}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {dayData.periods.map((period: Period, index: number) => {
                    // Format time from HH:MM to display format
                    const formatTime = (time: string) => {
                      const [hours, minutes] = time.split(':');
                      const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
                      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                      return { hour: hour12 || 12, minutes, ampm };
                    };

                    const startTime = formatTime(period.start_time);
                    const endTime = formatTime(period.end_time);

                    return (
                      <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-card-foreground">الفترة {index === 0 ? '1' : index === 1 ? '2' : `${index + 1}`}</span>
                        <div className="flex items-center justify-center gap-6 text-white">
                            {/* Start Time Box */}
                            <div className="relative border border-[#3E3A5A] rounded min-w-[100px] flex justify-between items-center">
                              {/* Top-right Label */}
                              <span className="absolute -top-2 right-2 bg-background px-1 text-xs font-bold text-card-foreground">
                                من
                              </span>
                              {/* Hour:Minutes and AM/PM */}
                              <span className="text-lg font-bold mx-3 ">{startTime.hour}:{startTime.minutes}</span>
                              <span className="bg-[#FF2E9C] text-white font-bold rounded px-2 py-2 mr-2">
                                {startTime.ampm}
                              </span>
                            </div>
                            {/* End Time Box */}
                            <div className="relative border border-[#3E3A5A] rounded min-w-[100px] flex justify-between items-center">
                              {/* Top-right Label */}
                              <span className="absolute -top-2 right-2 bg-background px-1 text-xs font-bold text-card-foreground">
                                إلى
                              </span>

                              {/* Hour:Minutes and AM/PM */}
                              <span className="text-lg font-bold mx-3 ">{endTime.hour}:{endTime.minutes}</span>
                              <span className="bg-[#FF2E9C] text-white font-bold rounded px-2 py-2 mr-2">
                                {endTime.ampm}
                              </span>
                            </div>
                          </div>

                      </div>
                    );
                  })}
                </div>
                
                <div className="text-xs text-muted-foreground mt-5">
                  عدد ساعات العمل : <span className="text-primary">{dayData.total_work_hours} ساعات</span>
                </div>
              </div>
            );
          })
        }
      </div>
    </DialogContainer>
  );
};

export default AttendanceStatusDialog;
