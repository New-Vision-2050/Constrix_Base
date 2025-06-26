"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAttendance } from "../../context/AttendanceContext";
import { AttendanceStatusRecord } from "../../types/attendance";

const AttendanceStatusDialog: React.FC = () => {
  const {
    isAttendanceStatusDialogOpen,
    selectedAttendanceRecord,
    closeAttendanceStatusDialog,
  } = useAttendance();

  if (!selectedAttendanceRecord) return null;

  return (
    <Dialog open={isAttendanceStatusDialogOpen} onOpenChange={closeAttendanceStatusDialog}>
      <DialogContent className="bg-[#171738] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            حالة الحضور
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* Employee Info */}
          <div className="flex justify-between items-center text-sm">
            <div className="text-white">الفرع: {selectedAttendanceRecord.branch}</div>
            <div className="text-white">الرقم الوظيفي: {selectedAttendanceRecord.employeeId}</div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="text-white">الإدارة: {selectedAttendanceRecord.department}</div>
            <div className={`font-bold ${selectedAttendanceRecord.attendanceStatus === "حاضر" ? "text-green-500" : selectedAttendanceRecord.attendanceStatus === "غائب" ? "text-red-500" : "text-yellow-400"}`}>
              {selectedAttendanceRecord.attendanceStatus}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="text-white">المحدد: {selectedAttendanceRecord.approver || "غير محدد"}</div>
            <div className="text-white">الفرع: {selectedAttendanceRecord.branch}</div>
          </div>

          {/* Attendance Time Box */}
          <div className="flex flex-col w-full bg-[#101026] border border-gray-700 rounded-md overflow-hidden">
            <div className="text-xs text-gray-400 text-left p-2 pb-0">الحضور</div>
            <div className="p-3 pt-0 text-left text-xl font-semibold">{selectedAttendanceRecord.attendanceTime || "8:12 صباحاً"}</div>
          </div>

          {/* Departure Time Box */}
          <div className="flex flex-col w-full bg-[#101026] border border-gray-700 rounded-md overflow-hidden">
            <div className="text-xs text-gray-400 text-left p-2 pb-0">الانصراف</div>
            <div className="p-3 pt-0 text-left text-xl font-semibold">{selectedAttendanceRecord.departureTime || "5:30 مساءاً"}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceStatusDialog;
