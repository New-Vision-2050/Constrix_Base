"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import { AttendanceStatusRecord } from "../../types/attendance";
import { UN_SPECIFIED } from "../../constants/static-data";

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
      {record.professional_data?.attendance_constraint?.constraint_name || UN_SPECIFIED}
    </span>
  );
};

export default ApproverBadge;
