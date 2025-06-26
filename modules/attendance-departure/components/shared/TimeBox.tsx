"use client";

import React from "react";
import { TimeBoxProps } from "../../types/attendance";

/**
 * Shared component for displaying a time box (attendance or departure)
 */
const TimeBox: React.FC<TimeBoxProps> = ({ label, time, defaultTime }) => {
  return (
    <div className="flex flex-col w-full bg-[#101026] border border-gray-700 rounded-md overflow-hidden">
      <div className="text-xs text-gray-400 text-left p-2 pb-0">{label}</div>
      <div className="p-3 pt-0 text-left text-xl font-semibold">
        {time || defaultTime || "غير محدد"}
      </div>
    </div>
  );
};

export default TimeBox;
