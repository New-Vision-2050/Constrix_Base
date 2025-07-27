import React from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { AttendanceHistory, AttendanceRecord } from "./types";
import AttendanceHistoryItem from "./AttendanceHistoryItem";
import { Loader2, Timer, Clock } from "lucide-react";
import { formatMinutesToHoursAndMinutes } from "../../utils/timeUtils";

interface AttendanceHistoryListProps {
  attendanceHistory: AttendanceHistory[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Component to display the attendance history list grouped by date
 */
const AttendanceHistoryList: React.FC<AttendanceHistoryListProps> = ({
  attendanceHistory,
  isLoading,
  error
}) => {
  const t = useTranslations("AttendanceDepartureModule.Map.employeeDetails");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        {t("errorLoadingHistory")}
      </div>
    );
  }

  if (!attendanceHistory || attendanceHistory.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        {t("noAttendanceRecords")}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-base font-medium mb-3 text-[#FF3B8B]">{t("attendanceHistory")}</h3>
      
      <div className="space-y-4">
        {attendanceHistory.map((history, index) => (
          <React.Fragment key={index}>
            {Object.entries(history).map(([timeRange, records]) => (
              <div key={timeRange} className="mb-4">
                <div className={`text-sm font-medium p-2 rounded-t-md ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}>
                  {timeRange}
                </div>
                
                <div className={`p-3 border rounded-b-md ${
                  isDarkMode ? "border-gray-700 bg-gray-800/30" : "border-gray-200"
                }`}>
                  {records.map((record) => (
                    <AttendanceHistoryItem key={record.id} record={record} />
                  ))}
                  
                  {records.length > 0 && (
                    <div className={`mt-3 pt-3 text-sm ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{t("totalActualHours")}:</span>
                        </div>
                        <span className="font-medium">
                          {records[0].total_work_hours}
                        </span>
                      </div>
                      
                      {/* Show deducted time if employee is late or left early */}
                      {(records[0].is_late || records[0].is_early_departure) && (
                        <div className="flex justify-between text-red-500">
                          <div className="flex items-center gap-1">
                            <Timer className="w-4 h-4 text-red-500" />
                            <span>{t("totalDeductedTime")}:</span>
                          </div>
                          <span className="font-medium">
                            {formatMinutesToHoursAndMinutes(
                              (records[0].is_late ? records[0].late_minutes : 0) + 
                              (records[0].is_early_departure ? records[0].early_departure_minutes : 0)
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHistoryList;
