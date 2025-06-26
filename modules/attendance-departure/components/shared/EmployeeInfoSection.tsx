"use client";

import React from "react";
import { AttendanceStatusRecord } from "../../types/attendance";

interface EmployeeInfoSectionProps {
  record: AttendanceStatusRecord;
}

/**
 * Shared component for displaying employee information in different dialogs
 */
const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({ record }) => {
  // Determine the color for attendance status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "حاضر":
        return "text-green-500";
      case "غائب":
        return "text-red-500";
      case "متأخر":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center text-sm">
        <div className="text-white">الفرع: {record.branch}</div>
        <div className="text-white">الرقم الوظيفي: {record.employeeId}</div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="text-white">الإدارة: {record.department}</div>
        <div className={`font-bold ${getStatusColor(record.attendanceStatus)}`}>
          {record.attendanceStatus}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="text-white">المعتمد: {record.approver || "غير محدد"}</div>
        <div className="text-white">الفرع: {record.branch}</div>
      </div>
    </>
  );
};

export default EmployeeInfoSection;
