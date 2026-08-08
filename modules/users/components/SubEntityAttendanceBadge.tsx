"use client";

import { useState } from "react";
import { apiClient, baseURL } from "@/config/axios-config";
import { cn } from "@/lib/utils";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type AttendanceStatusCode = "required_attendance" | "holiday";

const attendanceClassByCode: Record<AttendanceStatusCode, string> = {
  required_attendance: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  holiday: "bg-blue-500/15 text-blue-600 border-blue-500/30",
};

const DEFAULT_CODE: AttendanceStatusCode = "required_attendance";
const DEFAULT_LABEL_AR = "مطلوب للحضور";
const HOLIDAY_LABEL_AR = "اجازه";

interface SubEntityAttendanceBadgeProps {
  companyUserId: string;
  attendanceStatusCode?: string | null;
  attendanceStatusLabel?: string | null;
  attendanceId?: string | null;
  attendanceWorkDate?: string | null;
  attendanceDateFrom?: string | null;
  attendanceDateTo?: string | null;
  tableId?: string;
}

export function SubEntityAttendanceBadge({
  companyUserId,
  attendanceStatusCode,
  attendanceStatusLabel,
  attendanceWorkDate,
  attendanceDateFrom,
  attendanceDateTo,
  tableId,
}: SubEntityAttendanceBadgeProps) {
  const [loading, setLoading] = useState(false);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const currentCode: AttendanceStatusCode =
    attendanceStatusCode === "holiday" ? "holiday" : DEFAULT_CODE;
  const currentLabel =
    currentCode === "holiday"
      ? attendanceStatusLabel || HOLIDAY_LABEL_AR
      : attendanceStatusLabel || DEFAULT_LABEL_AR;

  const getWorkDate = () => {
    const columnSearchState = tableId
      ? useTableStore.getState().tables[tableId]?.columnSearchState
      : undefined;
    const startDate =
      columnSearchState?.start_date &&
      typeof columnSearchState.start_date === "string" &&
      columnSearchState.start_date !== "_clear_"
        ? columnSearchState.start_date
        : undefined;
    return attendanceWorkDate || startDate || undefined;
  };

  const updateTableRow = (payload: Record<string, any>, status: AttendanceStatusCode) => {
    if (!tableId) return;
    const tableState = useTableStore.getState().tables[tableId];
    if (!tableState) return;
    const updatedData = tableState.data.map((row: Record<string, any>) =>
      row.id === companyUserId
        ? {
            ...row,
            attendance_id: payload?.attendance_id ?? row.attendance_id,
            attendance_work_date:
              payload?.attendance_work_date ?? row.attendance_work_date,
            attendance_status_code:
              payload?.attendance_status_code ?? status,
            attendance_status_label:
              payload?.attendance_status_label ??
              (status === "holiday" ? HOLIDAY_LABEL_AR : DEFAULT_LABEL_AR),
            attendance_date_from:
              payload?.attendance_date_from ??
              (status === "holiday" ? dateFrom || undefined : null),
            attendance_date_to:
              payload?.attendance_date_to ??
              (status === "holiday" ? dateTo || undefined : null),
          }
        : row,
    );
    useTableStore.getState().setData(tableId, updatedData);
  };

  const handleSetHoliday = async () => {
    if (loading) return;
    if (!dateFrom || !dateTo) {
      setDateError("يرجى تحديد تاريخ البداية والنهاية");
      return;
    }
    if (dateTo < dateFrom) {
      setDateError("تاريخ النهاية يجب أن يكون بعد أو نفس تاريخ البداية");
      return;
    }

    const workDate = getWorkDate();
    setLoading(true);
    try {
      const res = await apiClient.patch(
        `${baseURL}/sub_entities/records/attendance-status`,
        {
          company_user_id: companyUserId,
          work_date: workDate,
          status: "holiday",
          date_from: dateFrom,
          date_to: dateTo,
        },
      );

      const payload = res.data?.payload ?? res.data;
      updateTableRow(payload, "holiday");
      toast.success("تم تحديث حالة الحضور بنجاح");
      setHolidayDialogOpen(false);
      setDateFrom("");
      setDateTo("");
      setDateError(null);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطأ أثناء تحديث حالة الحضور";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHoliday = async () => {
    if (loading) return;
    const workDate = getWorkDate();

    setLoading(true);
    try {
      const res = await apiClient.patch(
        `${baseURL}/sub_entities/records/attendance-status`,
        {
          company_user_id: companyUserId,
          work_date: workDate,
          status: "required_attendance",
        },
      );

      const payload = res.data?.payload ?? res.data;
      updateTableRow(payload, "required_attendance");
      toast.success("تم تحديث حالة الحضور بنجاح");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "حدث خطأ أثناء تحديث حالة الحضور";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const openHolidayDialog = () => {
    setDateError(null);
    setHolidayDialogOpen(true);
  };

  const formatDateRange = () => {
    if (!attendanceDateFrom) return null;
    if (attendanceDateTo) {
      return `${attendanceDateFrom} ← ${attendanceDateTo}`;
    }
    return `${attendanceDateFrom} ← ...`;
  };

  const dateRange = formatDateRange();

  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className={cn(
          "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
          attendanceClassByCode[currentCode],
        )}
      >
        {currentLabel}
      </span>
      {currentCode === "holiday" && dateRange && (
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {dateRange}
        </span>
      )}
      {currentCode === "required_attendance" ? (
        <button
          onClick={openHolidayDialog}
          disabled={loading}
          className={cn(
            "text-xs text-primary hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
          )}
        >
          {loading ? "..." : "تحويل إلى اجازه"}
        </button>
      ) : (
        <button
          onClick={handleClearHoliday}
          disabled={loading}
          className={cn(
            "text-xs text-primary hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
          )}
        >
          {loading ? "..." : "تحويل إلى مطلوب للحضور"}
        </button>
      )}

      <Dialog open={holidayDialogOpen} onOpenChange={setHolidayDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تحديد فترة الاجازه</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">من تاريخ</label>
              <Input
                type="date"
                variant="secondary"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setDateError(null);
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">إلى تاريخ</label>
              <Input
                type="date"
                variant="secondary"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setDateError(null);
                }}
              />
            </div>
            {dateError && (
              <p className="text-red-500 text-sm">{dateError}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setHolidayDialogOpen(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button onClick={handleSetHoliday} loading={loading}>
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SubEntityAttendanceBadge;
