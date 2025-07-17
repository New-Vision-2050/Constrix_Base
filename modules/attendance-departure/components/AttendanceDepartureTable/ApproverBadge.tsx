"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import { AttendanceStatusRecord } from "../../types/attendance";

interface ApproverBadgeProps {
  approver: string;
  record: AttendanceStatusRecord;
}


const ApproverBadge: React.FC<ApproverBadgeProps> = ({
  approver,
  record,
}) => {
  const { openApproverDialog } = useAttendance();

  return (
    <span
      className="font-medium cursor-pointer hover:underline"
      onClick={() => openApproverDialog(record)}
    >
      {approver || "غير محدد"}
    </span>
  );
};

export default ApproverBadge;
