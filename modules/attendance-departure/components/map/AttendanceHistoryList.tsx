import React from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { AttendanceHistory, AttendanceRecord } from "./types";
import AttendanceHistoryItem from "./AttendanceHistoryItem";
import { Loader2, Timer, Clock, Calendar } from "lucide-react";
import {
  formatMinutesToHoursAndMinutes,
  calculateHoursFromTimeRange,
  calculateMinutesFromTimeRange
} from "../../utils/timeUtils";

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
  error,
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
      <h3 className="text-base font-medium mb-3 text-[#FF3B8B]">
        {t("attendanceHistory")}
      </h3>

      <div className="space-y-4">
        {attendanceHistory.map((history, index) => (
          <React.Fragment key={index}>
            {Object.entries(history).map(([timeRange, records]) =>
              timeRange !== "total_hours" ? (
                <div key={timeRange} className="mb-4">
                  <div
                    className={`text-sm font-medium p-2 rounded-t-md flex justify-between items-center ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div>{timeRange}</div>
                  </div>

                  <div
                    className={`p-3 border rounded-b-md ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-800/30"
                        : "border-gray-200"
                    }`}
                  >
                    {timeRange !== "total_hours" &&
                      records.map((record) => (
                        <AttendanceHistoryItem
                          key={record.id}
                          record={record}
                        />
                      ))}

                    {records.length > 0 && (
                      <div
                        className={`mt-3 pt-3 text-sm ${
                          isDarkMode
                            ? "border-t border-gray-700"
                            : "border-t border-gray-200"
                        }`}
                      >
                        {/* Show total scheduled hours from timeRange */}
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{t("scheduledHours")}:</span>
                          </div>
                          <span className="font-medium">
                            {calculateHoursFromTimeRange(timeRange)}
                          </span>
                        </div>

                        {/* Show deducted time only if employee is actually late or left early and has deducted minutes */}
                        {(() => {
                          // Calculate deducted minutes
                          const lateMinutes = records[0].is_late ? records[0].late_minutes : 0;
                          const earlyDepartureMinutes = records[0].is_early_departure ? records[0].early_departure_minutes : 0;
                          const totalDeductedMinutes = lateMinutes + earlyDepartureMinutes;
                          
                          // Only show if there are actually deducted minutes
                          return totalDeductedMinutes > 0 ? (
                            <div className="flex justify-between text-red-500 mb-1">
                              <div className="flex items-center gap-1">
                                <Timer className="w-4 h-4" />
                                <span>{t("totalDeductedTime")}:</span>
                              </div>
                              <span className="font-medium">
                                {formatMinutesToHoursAndMinutes(totalDeductedMinutes)}
                              </span>
                            </div>
                          ) : null;
                        })()}
                        
                        {/* Show actual hours worked (schedule - deducted time) */}
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{t("totalActualHours")}:</span>
                          </div>
                          <span className="font-medium">
                            {(() => {
                              // Calculate scheduled minutes from timeRange
                              const scheduledMinutes = calculateMinutesFromTimeRange(timeRange);
                              
                              // Calculate deducted minutes - ONLY if the employee is actually marked as late or early departure
                              const lateMinutes = records[0].is_late ? records[0].late_minutes : 0;
                              const earlyDepartureMinutes = records[0].is_early_departure ? records[0].early_departure_minutes : 0;
                              const deductedMinutes = lateMinutes + earlyDepartureMinutes;
                              
                              // Calculate actual minutes worked - if no deductions, actual = scheduled
                              const actualMinutes = Math.max(0, scheduledMinutes - deductedMinutes);
                              
                              return formatMinutesToHoursAndMinutes(actualMinutes);
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHistoryList;
