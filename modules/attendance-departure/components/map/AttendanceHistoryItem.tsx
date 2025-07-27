import React from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { AttendanceRecord } from "./types";
import { Clock } from "lucide-react";

interface AttendanceHistoryItemProps {
  record: AttendanceRecord;
}

/**
 * A component that displays a single attendance record item
 */
const AttendanceHistoryItem: React.FC<AttendanceHistoryItemProps> = ({ record }) => {
  const t = useTranslations("AttendanceDepartureModule.Map.employeeDetails");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Format the time from ISO string to readable time
  const clockInTime = record.clock_in_time 
    ? new Date(record.clock_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : "-";
  
  const clockOutTime = record.clock_out_time 
    ? new Date(record.clock_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : "-";

  // Determine status color based on record status
  const getStatusColor = () => {
    if (record.is_absent === 1) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (record.is_late) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  };

  // Get status text
  const getStatusText = () => {
    if (record.is_absent === 1) return t("absent");
    if (record.is_late) return t("late");
    return t("present");
  };

  return (
    <div className={`p-3 rounded-md mb-2 ${isDarkMode ? "bg-gray-800/50" : "bg-gray-100"}`}>
      <div className="flex justify-between items-center mb-2">
        <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {record.total_work_hours} {t("hours")}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2 rounded ${isDarkMode ? "bg-gray-700/50" : "bg-white"}`}>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            {t("checkIn")}
          </div>
          <div className="text-sm font-medium">{clockInTime}</div>
        </div>
        
        <div className={`p-2 rounded ${isDarkMode ? "bg-gray-700/50" : "bg-white"}`}>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3" />
            {t("checkOut")}
          </div>
          <div className="text-sm font-medium">{clockOutTime}</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryItem;
