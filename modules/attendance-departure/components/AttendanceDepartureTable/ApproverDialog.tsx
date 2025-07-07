"use client";

import React from "react";
import DialogContainer from "../../components/shared/DialogContainer";
import DisplayField from "../../components/shared/DisplayField";
import EmployeeInfoSection from "../../components/shared/EmployeeInfoSection";
import WorkdayPeriods, {
  PeriodType,
} from "../../components/shared/WorkdayPeriods";
import { useAttendance } from "../../context/AttendanceContext";

/**
 * Approver dialog component that appears when clicking on the approver cell in the table
 */
const ApproverDialog: React.FC = () => {
  const { isApproverDialogOpen, selectedApproverRecord, closeApproverDialog } =
    useAttendance();

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
          value={selectedApproverRecord.approved_by_user}
          defaultValue="فرع القاهرة"
        />

        <DisplayField label="نظام المحدد" value="مصمم" />

        {/* Workday Periods */}
        <WorkdayPeriods
          title="السبت"
          periods={[
            {
              id: 1,
              label: "الفترة الأولى",
              fromValue: "2",
              fromPeriod: "PM",
              toValue: "5",
              toPeriod: "PM",
            },
            {
              id: 2,
              label: "الفترة الثانية",
              fromValue: "8",
              fromPeriod: "PM",
              toValue: "2",
              toPeriod: "AM",
            },
          ]}
        />

        <WorkdayPeriods
          title="الأحد"
          periods={[
            {
              id: 1,
              label: "الفترة الأولى",
              fromValue: "2",
              fromPeriod: "PM",
              toValue: "5",
              toPeriod: "PM",
            },
          ]}
        />

        <div className="text-xs text-[#E91E63] text-left">
          عدد ساعات العمل: 8 ساعات
        </div>
      </div>
    </DialogContainer>
  );
};

export default ApproverDialog;
