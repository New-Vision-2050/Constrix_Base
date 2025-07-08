import { baseURL } from "@/config/axios-config";
import AttendanceStatusBadge from "../components/AttendanceDepartureTable/AttendanceStatusBadge";
import ApproverBadge from "../components/AttendanceDepartureTable/ApproverBadge";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import { AttendanceStatusRecord } from "../types/attendance";
import React from "react";

// Configuration function for the attendance departure table
export const getAttendanceDepartureTableConfig = () => {
  return {
    url: `${baseURL}/attendance/team`,
    tableId: "attendance-departure-table",
    columns: [
      {
        key: "user.name",
        label: "الاسم",
        sortable: true,
        searchable: true,
        render: (value: any, row: AttendanceStatusRecord) =>
          row.user?.name || "-",
      },
      {
        key: "work_date",
        label: "التاريخ",
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => row.work_date,
      },
      {
        key: "professional_data.job_code",
        label: "الرقم الوظيفي",
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) =>
          row.professional_data?.job_code || "-",
      },
      {
        key: "professional_data.branch",
        label: "الفرع",
        sortable: true,
        searchable: true,
        render: (value: any, row: AttendanceStatusRecord) =>
          row.professional_data?.branch || "-",
      },
      {
        key: "professional_data.management",
        label: "الادارة",
        sortable: true,
        searchable: true,
        render: (value: any, row: AttendanceStatusRecord) =>
          row.professional_data?.management || "-",
      },
      // {
      //   key: "clock_in_time",
      //   label: "وقت الحضور",
      //   sortable: true,
      //   render: (value: any, row: AttendanceStatusRecord) =>
      //     row.clock_in_time || "-",
      // },
      {
        key: "approved_by_user",
        label: "المحدد المعتمد",
        sortable: true,
        searchable: true,
        render: (value: any, row: AttendanceStatusRecord) => (
          <ApproverBadge
            approver={row?.applied_constraints?.[0]?.name ?? "غير محدد"}
            record={row}
          />
        ),
      },
      {
        key: "is_late",
        label: "حالة الموظف",
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) =>
          row.is_late ? "متأخر" : "في الوقت",
      },
      {
        key: "status",
        label: "حالة الحضور",
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => (
          <AttendanceStatusBadge status={row.status} record={row} />
        ),
      },
    ] as ColumnConfig[],
    deleteConfirmMessage: "تأكيد حذف سجل الحضور والانصراف",
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    executions: [],
    executionConfig: {
      canEdit: false,
      canDelete: false,
    },
  };
};
