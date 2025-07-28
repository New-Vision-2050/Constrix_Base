import React from "react";
import { useTranslations } from "next-intl";
import { useAttendance } from "../../context/AttendanceContext";
import { AttendanceStatusRecord } from "../../types/attendance";
import { UN_SPECIFIED } from "../../constants/static-data";

interface AttendanceStatusBadgeProps {
  record: AttendanceStatusRecord;
  status?: string;
}

/**
 * Component to display the attendance status in the table and open the attendance status dialog when clicked
 */
export const AttendanceStatusBadge = ({
  record,
  status,
}: AttendanceStatusBadgeProps) => {
  const { openApproverDialog } = useAttendance();
  const t = useTranslations("attendanceDeparture.status");
  let color = "";
  let text = "";
  let _status = "";
  if (record.is_absent === 1) {
    _status = "absent";
  } else if (record.is_holiday === 1) {
    _status = "holiday";
  } else if (record.is_late === 1) {
    _status = "late";
  } else if (
    record.status === "active" ||
    record.status === "completed"
  ) {
    _status = "present";
  }

  // Map the backend status to display text
  switch (_status) {
    case "present":
      text = t("present");
      color = "text-green-500";
      break;
    case "absent":
      text = t("absent");
      color = "text-red-500";
      break;
    case "late":
      text = t("late");
      color = "text-yellow-400";
      break;
    case "holiday":
      text = t("holiday");
      color = "text-blue-500";
      break;
    default:
      text = status || t("unspecified");
      color = "text-gray-400";
      break;
  }

  // Separated interactive styles from color styles
  const interactiveStyles = "cursor-pointer hover:underline";

  return (
    <span
      className={`font-bold ${interactiveStyles} ${color}`}
      onClick={() => openApproverDialog(record)}
    >
      {text}
    </span>
  );
};

export default AttendanceStatusBadge;
