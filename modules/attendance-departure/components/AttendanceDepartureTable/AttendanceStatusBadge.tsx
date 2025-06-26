import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import { AttendanceStatusRecord } from "../../types/attendance";

interface AttendanceStatusBadgeProps {
  status: string;
  record: AttendanceStatusRecord; // The full attendance record
}

/**
 * Component to display the attendance status in the table and open the attendance status dialog when clicked
 */
const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({
  status,
  record,
}) => {
  const { openAttendanceStatusDialog } = useAttendance();
  let color = "";
  let text = status;

  switch (status) {
    case "حاضر":
      color = "text-green-500";
      break;
    case "غائب":
      color = "text-red-500";
      break;
    case "متأخر":
      color = "text-yellow-400";
      break;
    default:
      color = "text-gray-400";
      break;
  }

  return (
    <span
      className={`font-bold cursor-pointer ${color} hover:underline`}
      onClick={() => openAttendanceStatusDialog(record)}
    >
      {text}
    </span>
  );
};

export default AttendanceStatusBadge;
