"use client";

import React from "react";
import DialogContainer from "../../components/shared/DialogContainer";
import DisplayField from "../../components/shared/DisplayField";
import EmployeeInfoSection from "../../components/shared/EmployeeInfoSection";
import WorkdayPeriods, {
  PeriodType,
} from "../../components/shared/WorkdayPeriods";
import { useAttendance } from "../../context/AttendanceContext";


const days = {
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت"
};

/**
 * Approver dialog component that appears when clicking on the approver cell in the table
 */
const ApproverDialog: React.FC = () => {
  const { isApproverDialogOpen, selectedApproverRecord, closeApproverDialog } =
    useAttendance();
  console.log('selectedApproverRecord',selectedApproverRecord?.applied_constraints?.[0]?.name,selectedApproverRecord);

  if (!selectedApproverRecord) return null;

  return (
    <DialogContainer
      isOpen={isApproverDialogOpen}
      onClose={closeApproverDialog}
      title="بيانات محدد الحضور"
    >
      {/* Employee Information */}
      <EmployeeInfoSection record={selectedApproverRecord} />

      {/* Data Input Fields */}
      <div className="flex flex-col gap-4">
        <DisplayField
          label="اسم المحدد"
          value={selectedApproverRecord?.applied_constraints?.[0]?.name}
          defaultValue="غير محدد"
        />

        <DisplayField label="نظام المحدد" value={selectedApproverRecord?.applied_constraints?.[0]?.name} />

        {/* Workday Periods */}
        {selectedApproverRecord?.applied_constraints?.[0]?.config?.time_rules?.weekly_schedule && 
          Object.entries(selectedApproverRecord.applied_constraints[0].config.time_rules.weekly_schedule).map(([day, dayData]) => {
            // Skip days that aren't enabled
            if (!dayData.enabled || !dayData.periods || dayData.periods.length === 0) return null;
            
            return (
              <WorkdayPeriods
                key={day}
                hours={dayData.total_work_hours}
                title={days[day as keyof typeof days]}
                periods={dayData.periods.map((period, index) => {
                  // Extract hours and convert to 12-hour format for display
                  const startTime = new Date(`2023-01-01T${period.start_time}`);
                  const endTime = new Date(`2023-01-01T${period.end_time}`);
                  
                  const startHour = startTime.getHours();
                  const startPeriod = startHour >= 12 ? "PM" : "AM";
                  const start12Hour = startHour > 12 ? startHour - 12 : startHour === 0 ? 12 : startHour;
                  
                  const endHour = endTime.getHours();
                  const endPeriod = endHour >= 12 ? "PM" : "AM";
                  const end12Hour = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;
                  
                  return {
                    id: index + 1,
                    label: `الفترة ${index + 1}`,
                    fromValue: start12Hour.toString(),
                    fromPeriod: startPeriod,
                    toValue: end12Hour.toString(),
                    toPeriod: endPeriod,
                  };
                })}
              />
            );
          })
        }
        {!selectedApproverRecord?.applied_constraints?.[0]?.config?.time_rules?.weekly_schedule && (
          <WorkdayPeriods
            title="لا يوجد جدول أسبوعي"
            periods={[]}
            hours={0}
          />
        )}

        <div className="text-xs text-[#E91E63] text-left">
          عدد ساعات العمل: 8 ساعات
        </div>
      </div>
    </DialogContainer>
  );
};

export default ApproverDialog;
