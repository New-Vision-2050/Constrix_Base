import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import { AttendanceStatusRecord } from "../../types/attendance";

interface AttendanceStatusBadgeProps {
  status: string; // This will now contain the status from the backend
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
  let text = "";
  //is_late
  let _status = record.status;
  if (record.is_late === 0) {
    _status = "present";
  } else if (record.is_late === 1) {
    _status = "late";
  } else {
    _status = "absent";
  }

  // Map the backend status to display text
  switch (_status) {
    case "present":
      text = "حاضر";
      color = "text-green-500";
      break;
    case "absent":
      text = "غائب";
      color = "text-red-500";
      break;
    case "late":
      text = "متأخر";
      color = "text-yellow-400";
      break;
    case "on_leave":
      text = "في إجازة";
      color = "text-blue-500";
      break;
    default:
      text = status || "غير محدد";
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
