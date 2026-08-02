"use client";

import { useState } from "react";
import { apiClient, baseURL } from "@/config/axios-config";
import { cn } from "@/lib/utils";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { toast } from "sonner";

export type AttendanceStatusCode = "required_attendance" | "holiday";

const attendanceClassByCode: Record<AttendanceStatusCode, string> = {
  required_attendance: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  holiday: "bg-blue-500/15 text-blue-600 border-blue-500/30",
};

const DEFAULT_CODE: AttendanceStatusCode = "required_attendance";
const DEFAULT_LABEL_AR = "مطلوب للحضور";
const HOLIDAY_LABEL_AR = "اجازه";

const TOGGLE_ACTION: Record<
  AttendanceStatusCode,
  { status: AttendanceStatusCode; label: string }
> = {
  required_attendance: { status: "holiday", label: "تحويل إلى اجازه" },
  holiday: { status: "required_attendance", label: "تحويل إلى مطلوب للحضور" },
};

interface SubEntityAttendanceBadgeProps {
  companyUserId: string;
  attendanceStatusCode?: string | null;
  attendanceStatusLabel?: string | null;
  attendanceId?: string | null;
  attendanceWorkDate?: string | null;
  tableId?: string;
}

export function SubEntityAttendanceBadge({
  companyUserId,
  attendanceStatusCode,
  attendanceStatusLabel,
  attendanceWorkDate,
  tableId,
}: SubEntityAttendanceBadgeProps) {
  const [loading, setLoading] = useState(false);

  const currentCode: AttendanceStatusCode =
    attendanceStatusCode === "holiday" ? "holiday" : DEFAULT_CODE;
  const currentLabel =
    currentCode === "holiday"
      ? attendanceStatusLabel || HOLIDAY_LABEL_AR
      : attendanceStatusLabel || DEFAULT_LABEL_AR;

  const toggle = TOGGLE_ACTION[currentCode];

  const handleToggle = async () => {
    if (loading) return;

    const columnSearchState = tableId
      ? useTableStore.getState().tables[tableId]?.columnSearchState
      : undefined;
    const startDate =
      columnSearchState?.start_date &&
      typeof columnSearchState.start_date === "string" &&
      columnSearchState.start_date !== "_clear_"
        ? columnSearchState.start_date
        : undefined;
    const workDate = attendanceWorkDate || startDate || undefined;

    setLoading(true);
    try {
      const res = await apiClient.patch(
        `${baseURL}/sub_entities/records/attendance-status`,
        {
          company_user_id: companyUserId,
          work_date: workDate,
          status: toggle.status,
        },
      );

      const payload = res.data?.payload ?? res.data;

      if (tableId) {
        const tableState = useTableStore.getState().tables[tableId];
        if (tableState) {
          const updatedData = tableState.data.map((row: Record<string, any>) =>
            row.id === companyUserId
              ? {
                  ...row,
                  attendance_id: payload?.attendance_id ?? row.attendance_id,
                  attendance_work_date:
                    payload?.attendance_work_date ?? row.attendance_work_date,
                  attendance_status_code:
                    payload?.attendance_status_code ?? toggle.status,
                  attendance_status_label:
                    payload?.attendance_status_label ??
                    (toggle.status === "holiday"
                      ? HOLIDAY_LABEL_AR
                      : DEFAULT_LABEL_AR),
                }
              : row,
          );
          useTableStore.getState().setData(tableId, updatedData);
        }
      }

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
      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "text-xs text-primary hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        )}
      >
        {loading ? "..." : toggle.label}
      </button>
    </div>
  );
}

export default SubEntityAttendanceBadge;
