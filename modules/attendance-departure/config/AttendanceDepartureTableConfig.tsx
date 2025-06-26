import { baseURL } from "@/config/axios-config";
import AttendanceStatusBadge from "../components/AttendanceDepartureTable/AttendanceStatusBadge";
import ApproverBadge from "../components/AttendanceDepartureTable/ApproverBadge";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import { AttendanceStatusRecord } from "../types/attendance";
import React from "react";

// Creamos una función que retorna la configuración de la tabla
export const getAttendanceDepartureTableConfig = () => {
  return {
    url: `${baseURL}/attendance-departure`,
    tableId: "attendance-departure-table",
    columns: [
      { 
        key: "name", 
        label: "الاسم", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => row.name 
      },
      { 
        key: "date", 
        label: "التاريخ", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => row.date 
      },
      { 
        key: "employeeId", 
        label: "الرقم الوظيفي", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => row.employeeId 
      },
      { 
        key: "branch", 
        label: "الفرع", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => row.branch 
      },
      { 
        key: "department", 
        label: "الإدارة", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => row.department 
      },
      { 
        key: "approver", 
        label: "المعتمد", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => <ApproverBadge approver={row.approver} record={row} /> 
      },
      { 
        key: "employeeStatus", 
        label: "حالة الموظف", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => row.employeeStatus 
      },
      { 
        key: "attendanceStatus", 
        label: "حالة الحضور", 
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => <AttendanceStatusBadge status={row.attendanceStatus} record={row} /> 
      }
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
      canEdit: true,
      canDelete: true
    }
  };
};
