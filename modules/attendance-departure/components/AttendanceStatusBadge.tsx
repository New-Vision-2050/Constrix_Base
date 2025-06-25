import React from "react";

interface AttendanceStatusBadgeProps {
  status: string;
}

const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({ status }) => {
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
  return <span className={`font-bold cursor-pointer ${color}`}>{text}</span>;
};

export default AttendanceStatusBadge;
