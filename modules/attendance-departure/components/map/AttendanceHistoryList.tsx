import React from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { AttendanceHistory } from "./types";
import AttendanceHistoryItem from "./AttendanceHistoryItem";
import { Loader2 } from "lucide-react";

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
      <h3 className="text-base font-medium mb-3">{t("attendanceHistory")}</h3>
      
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
