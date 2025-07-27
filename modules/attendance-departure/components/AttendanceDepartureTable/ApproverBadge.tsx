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
  const { openAttendanceStatusDialog } = useAttendance();

  return (
    <span
      className="font-medium cursor-pointer underline text-blue-500 dark:text-blue-400"
      onClick={() => openAttendanceStatusDialog(record)}
    >
      {record.professional_data?.attendance_constraint || UN_SPECIFIED}
    </span>
  );
};

export default ApproverBadge;
