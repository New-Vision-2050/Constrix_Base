"use client";

import React from "react";
import DialogContainer from "../../components/shared/DialogContainer";
import EmployeeInfoSection from "../../components/shared/EmployeeInfoSection";
import { useAttendance } from "../../context/AttendanceContext";
import { useTranslations } from "next-intl";
import { AttendanceHistoryRecord } from "../../types/attendance";
import { LoaderCircle } from "lucide-react";


const ApproverDialog: React.FC = () => {
  const { isApproverDialogOpen, attendanceHistoryPayload, attendanceHistoryLoading, closeApproverDialog } =
    useAttendance();
  const t = useTranslations("AttendanceDepartureModule.Table.dialogs.approver");



  const formatTimeWithArabicAMPM = (dateTimeString: string | null) => {
    if (!dateTimeString) return t("unspecified");
    
    try {
      const date = new Date(dateTimeString);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      // Convert to 12-hour format
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours < 12 ? 'صباحاً' : 'مساءً';
      
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatTimeRangeWithArabic = (timeRange: string) => {
    try {
      const parts = timeRange.split(' - ');
      if (parts.length === 2) {
        const formatDateTime = (dateTimeStr: string) => {
          const [datePart, timePart] = dateTimeStr.split(' ');
          const [year, month, day] = datePart.split('-');
          const formattedDate = `${day}/${month}/${year}`;
          
          // Convert 24-hour time to 12-hour format with Arabic AM/PM
          const [hours, minutes] = timePart.split(':');
          const hour24 = parseInt(hours, 10);
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          const ampm = hour24 < 12 ? 'صباحا' : 'مساءا';
          const formattedTime = `${hour12}:${minutes} ${ampm}`;
          
          return { date: formattedDate, time: formattedTime };
        };
        
        const fromDateTime = formatDateTime(parts[0]);
        const toDateTime = formatDateTime(parts[1]);
        
        return (
          <>
            من
            <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded mx-1">
              {fromDateTime.date}
            </span>
            <span className="font-semibold text-secondary-foreground bg-secondary px-2 py-1 rounded mx-1">
              {fromDateTime.time}
            </span>
            إلى
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

  if (!attendanceHistoryPayload || attendanceHistoryPayload.length === 0) return null;

  return (
    <DialogContainer
      isOpen={isApproverDialogOpen}
      onClose={closeApproverDialog}
      title={"حالة الحضور"}
      >
        {
          attendanceHistoryLoading ? (
            <div className="flex justify-center items-center">
              <LoaderCircle />
            </div>
          ) : (
            <>
              {/* Display employee info from first record if available */}
              {(() => {
                const firstPayload = attendanceHistoryPayload[0];
                if (firstPayload) {
                  const firstTimeRangeRecords = Object.entries(firstPayload)
                    .find(([key, value]) => key !== 'total_hours' && Array.isArray(value))?.[1];
                  if (firstTimeRangeRecords && Array.isArray(firstTimeRangeRecords) && firstTimeRangeRecords[0]) {
                    return <EmployeeInfoSection record={firstTimeRangeRecords[0]} />;
                  }
                }
                return null;
              })()}
              
              {/* Tree Structure: Array -> Time Range Objects -> Records */}
              {attendanceHistoryPayload.map((payloadItem, arrayIndex) => (
                <div key={arrayIndex} className="mb-6">
                  
                  
                  {/* Time Range Objects */}
                  {Object.entries(payloadItem)
                    .filter(([key, value]) => key !== 'total_hours' && Array.isArray(value))
                    .map(([timeRange, records], timeRangeIndex) => (
                    <div key={timeRange} className="relative my-4">
                      <div className="relative border border-border rounded-lg px-4 py-5">
                        <span className="absolute -top-3 right-4 bg-background px-2 text-md">
                          الفترة {timeRangeIndex + 1} : {formatTimeRangeWithArabic(timeRange)}
                        </span>

                        {/* Records within this time range */}
                        <div className="space-y-4 mt-2">
                          {(records as AttendanceHistoryRecord[]).map((record: AttendanceHistoryRecord, recordIndex: number) => (
                            <div key={record.id} className="rounded-md p-3">
                              {/* Inner Time Boxes */}
                              <div className="flex flex-col gap-4">
                                {/* Attendance */}
                                <div className="relative border border-border rounded-md px-4 py-3 text-right bg-background">
                                  <span className="absolute -top-2 right-4 bg-background px-1 text-xs text-muted-foreground font-semibold">
                                    الحضور
                                  </span>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-md font-semibold">{formatTimeWithArabicAMPM(record?.clock_in_time || null)}</span>
                                  </div>
                                </div>

                                {/* Departure */}
                                <div className="relative border border-border rounded-md px-4 py-3 text-right bg-background">
                                  <span className="absolute -top-2 right-4 bg-background px-1 text-xs text-muted-foreground font-semibold">
                                    الانصراف
                                  </span>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-md font-semibold">{formatTimeWithArabicAMPM(record?.clock_out_time || null)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              
              {/* Summary Box */}
              <div className="mt-6 border border-primary rounded-lg p-4 bg-primary/5">
                <h3 className="text-lg font-bold text-foreground mb-4 text-center">
                  ملخص الحضور
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Total Attendance Hours */}
                  <div className="relative border border-border rounded-md px-4 py-3 text-center bg-background">
                    <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground font-semibold">
                      إجمالي  ساعات الحضور
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {20}
                    </span>
                  </div>
                  
                  {/* Total Delay Hours */}
                  <div className="relative border border-border rounded-md px-4 py-3 text-center bg-background">
                    <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-background px-2 text-xs text-muted-foreground font-semibold">
                      إجمالي  ساعات التأخير
                    </span>
                    <span className="text-lg font-bold text-destructive">
                      {10}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )
        }
      
     
    </DialogContainer>
  );
};

export default ApproverDialog;
