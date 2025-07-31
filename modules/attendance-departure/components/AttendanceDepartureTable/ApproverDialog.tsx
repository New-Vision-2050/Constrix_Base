"use client";

import React from "react";
import DialogContainer from "../../components/shared/DialogContainer";
import EmployeeInfoSection from "../../components/shared/EmployeeInfoSection";
import { useAttendance } from "../../context/AttendanceContext";
import { useTranslations } from "next-intl";
import { AttendanceHistoryRecord } from "../../types/attendance";
import { LoaderCircle } from "lucide-react";

const ApproverDialog: React.FC = () => {
  const {
    currentRecord,
    isApproverDialogOpen,
    attendanceHistoryPayload,
    attendanceHistoryLoading,
    closeApproverDialog,
  } = useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table.dialogs.approver");

  const isAbsent = Boolean(currentRecord?.is_absent);

  const formatTimeWithArabicAMPM = (dateTimeString: string | null) => {
    if (!dateTimeString) return t("unspecified");

    try {
      const date = new Date(dateTimeString);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");

      // Convert to 12-hour format
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours < 12 ? "صباحاً" : "مساءً";

      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatTimeRangeWithArabic = (timeRange: string) => {
    try {
      const parts = timeRange.split(" - ");
      if (parts.length === 2) {
        const formatDateTime = (dateTimeStr: string) => {
          const [datePart, timePart] = dateTimeStr.split(" ");
          const [year, month, day] = datePart.split("-");
          const formattedDate = `${day}/${month}/${year}`;

          // Convert 24-hour time to 12-hour format with Arabic AM/PM
          const [hours, minutes] = timePart.split(":");
          const hour24 = parseInt(hours, 10);
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          const ampm = hour24 < 12 ? "صباحا" : "مساءا";
          const formattedTime = `${hour12}:${minutes} ${ampm}`;

          return { date: formattedDate, time: formattedTime };
        };

        const fromDateTime = formatDateTime(parts[0]);
        const toDateTime = formatDateTime(parts[1]);

        return (
          <>
            {t("from")}
            <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded mx-1">
              {fromDateTime.date}
            </span>
            <span className="font-semibold text-secondary-foreground bg-secondary px-2 py-1 rounded mx-1">
              {fromDateTime.time}
            </span>
            {t("to")}
            <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded mx-1">
              {toDateTime.date}
            </span>
            <span className="font-semibold text-secondary-foreground bg-secondary px-2 py-1 rounded mx-1">
              {toDateTime.time}
            </span>
          </>
        );
      }
      return timeRange;
    } catch (error) {
      return timeRange;
    }
  };

  if (!attendanceHistoryPayload || attendanceHistoryPayload.length === 0)
    return null;

  return (
    <DialogContainer
      isOpen={isApproverDialogOpen}
      onClose={closeApproverDialog}
      title={t("title")}
    >
      <EmployeeInfoSection record={currentRecord} />
      {isAbsent ? (
        <div className="flex justify-center items-center my-12">
          <div className="text-center py-8 px-6 bg-destructive/10 rounded-lg border border-destructive">
            <h3 className="text-xl font-bold text-destructive mb-1">
              {t("noRecords")}
            </h3>
            <p className="text-muted-foreground">
              {t("noRecordsMessage")}
            </p>
          </div>
        </div>
      ) : attendanceHistoryLoading ? (
        <div className="flex justify-center items-center p-8">
          <LoaderCircle className="mr-2 animate-spin" />
          <span>{t("loading")}</span>
        </div>
      ) : (
        <>
          {/* Tree Structure: Array -> Time Range Objects -> Records */}
          {attendanceHistoryPayload.map((payloadItem, arrayIndex) => (
            <div key={arrayIndex} className="mb-6">
              {/* Time Range Objects */}
              {Object.entries(payloadItem)
                .filter(
                  ([key, value]) =>
                    key !== "total_hours" && Array.isArray(value)
                )
                .map(([timeRange, records], timeRangeIndex) => (
                  <div key={timeRange} className="relative my-4">
                    <div className="relative border border-border rounded-lg px-4 py-5">
                      <span className="absolute -top-3 right-4 bg-background px-2 text-md">
                        {t("period")} {timeRangeIndex + 1} :{" "}
                        {formatTimeRangeWithArabic(timeRange)}
                      </span>

                      {/* Records within this time range */}
                      <div className="space-y-4 mt-2">
                        {(records as AttendanceHistoryRecord[]).map(
                          (
                            record: AttendanceHistoryRecord,
                            recordIndex: number
                          ) => (
                            <div key={record.id} className="rounded-md p-3">
                              {/* Inner Time Boxes */}
                              <div className="flex flex-col gap-4">
                                {/* Attendance */}
                                <div className="relative border border-border rounded-md px-4 py-3 text-right bg-background">
                                  <span className="absolute -top-2 right-4 bg-background px-1 text-xs text-muted-foreground font-semibold">
                                    {t("attendance")}
                                  </span>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-md font-semibold">
                                      {formatTimeWithArabicAMPM(
                                        record?.clock_in_time || null
                                      )}
                                    </span>
                                  </div>
                                </div>

                                {/* Departure */}
                                <div className="relative border border-border rounded-md px-4 py-3 text-right bg-background">
                                  <span className="absolute -top-2 right-4 bg-background px-1 text-xs text-muted-foreground font-semibold">
                                    {t("departure")}
                                  </span>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-md font-semibold">
                                      {formatTimeWithArabicAMPM(
                                        record?.clock_out_time || null
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        
                        {/* Period Summary - Calculate and display total hours for this period */}
                        {(() => {
                          // Calculate total attendance and departure hours for this period
                          let periodTotalWorkHours = 0;
                          let periodTotalDelayMinutes = 0;
                          
                          // Process records to calculate totals
                          (records as AttendanceHistoryRecord[]).forEach((record) => {
                            // Use total_work_hours directly from the record
                            if (record.total_work_hours) {
                              periodTotalWorkHours += +record.total_work_hours;
                            }
                            
                            // Use late_minutes directly from the record
                            if (record.late_minutes) {
                              periodTotalDelayMinutes += +record.late_minutes;
                            }
                          });
                          
                          // Convert delay minutes to hours for display
                          const periodTotalDelayHours = (periodTotalDelayMinutes / 60);
                          
                          return (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Period Total Work Hours */}
                                <div className="relative border border-border rounded-md px-3 py-2 text-center bg-background">
                                  <span className="absolute -top-2 right-4 transform bg-background px-2 text-xs text-muted-foreground font-semibold">
                                    {t("totalAttendance")}
                                  </span>
                                  <span className="text-md font-bold text-primary">
                                    {periodTotalWorkHours.toFixed(2)}
                                  </span>
                                </div>
                                
                                {/* Period Total Delay Hours */}
                                <div className="relative border border-border rounded-md px-3 py-2 text-center bg-background">
                                  <span className="absolute -top-2 right-4 transform bg-background px-2 text-xs text-muted-foreground font-semibold">
                                    {t("totalDelay")}
                                  </span>
                                  <span className="text-md font-bold text-destructive">
                                    {periodTotalDelayHours.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}

          {/* Calculate attendance summary */}
          {(() => {
            // Calculate total attendance hours and delay minutes
            let totalAttendanceHours = 0;
            let totalDelayMinutes = 0;

            // Process all payload items
            attendanceHistoryPayload.forEach((payloadItem) => {
              // Add total hours if available
              if (payloadItem.total_work_hours) {
                totalAttendanceHours += +payloadItem.total_work_hours;
              }

              // Process each record for delay minutes
              Object.entries(payloadItem)
                .filter(
                  ([key, value]) =>
                    key !== "total_hours" && Array.isArray(value)
                )
                .forEach(([_, records]) => {
                  (records as AttendanceHistoryRecord[]).forEach((record) => {
                    if (record.total_work_hours) {
                      totalAttendanceHours += +record.total_work_hours;
                    }
                    if (record.late_minutes) {
                      totalDelayMinutes += +record.late_minutes;
                    }
                  });
                });
            });

            // Convert delay minutes to hours for display
            const totalDelayHours = (totalDelayMinutes / 60).toFixed(2);

            // Only display the summary box if we have attendance records
            const hasAttendanceRecords = attendanceHistoryPayload.some(
              (payloadItem) =>
                Object.entries(payloadItem)
                  .filter(
                    ([key, value]) =>
                      key !== "total_hours" && Array.isArray(value)
                  )
                  .some(
                    ([_, records]) =>
                      records &&
                      Array.isArray(records) &&
                      records.length > 0 &&
                      records[0]?.clock_in_time
                  )
            );

            if (!hasAttendanceRecords) {
              return null;
            }

            return (
              <div className="mt-6 border border-primary rounded-lg p-4 bg-primary/5">
                <h3 className="text-lg font-bold text-foreground mb-4 text-center">
                  {t("summary")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Attendance Hours */}
                  <div className="relative border border-border rounded-md px-4 py-3 text-center bg-background">
                    <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground font-semibold">
                      {t("totalAttendance")}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {totalAttendanceHours.toFixed(2)}
                    </span>
                  </div>

                  {/* Total Delay Hours */}
                  <div className="relative border border-border rounded-md px-4 py-3 text-center bg-background">
                    <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground font-semibold">
                      {t("totalDelay")}
                    </span>
                    <span className="text-lg font-bold text-destructive">
                      {totalDelayHours}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </DialogContainer>
  );
};

export default ApproverDialog;
