"use client";

import React from "react";
import { AttendanceStatusRecord } from "../../types/attendance";

interface EmployeeInfoSectionProps {
  record: AttendanceStatusRecord;
}

/**
 * Shared component for displaying employee information in different dialogs
 */
const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({
  record,
}) => {
  // Determine the color for attendance status
  const getStatusColor = () => {
    if (record.is_late === 0) {
      return "text-green-500";
    } else if (record.is_late === 1) {
      return "text-yellow-400";
    } else {
      return "text-red-500";
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center text-sm gap-3">
        <div className="text-white">الفرع: {record.company.name}</div>
        <div className="text-white">الرقم الوظيفي: emp-101</div>
        <div className="text-white">الإدارة: {record.company.name}</div>
        <div className="text-white">
          المحدد: {record?.applied_constraints?.[0]?.name || "غير محدد"}
        </div>
        <div className="text-white">
          حالة الحضور:
          <span className={`font-bold ${getStatusColor()}`}>
            {record.is_late === 0 ? "حاضر" : record.is_late === 1 ? "متأخر" : "غائب"}
          </span>
        </div>
      </div>
    </>
  );
};

export default EmployeeInfoSection;
