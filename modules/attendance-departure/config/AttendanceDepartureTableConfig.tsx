import { baseURL } from "@/config/axios-config";
import AttendanceStatusBadge from "../components/AttendanceDepartureTable/AttendanceStatusBadge";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import React from "react";

interface AttendanceRecord {
  id: number;
  name: string;
  date: string;
  employeeId: string;
  branch: string;
  department: string;
  approver: string;
  employeeStatus: string;
  attendanceStatus: string;
}

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
        render: (value: any, row: AttendanceRecord) => row.name 
      },
      { 
        key: "date", 
        label: "التاريخ", 
        sortable: true,
        render: (value: any, row: AttendanceRecord) => row.date 
      },
      { 
        key: "employeeId", 
        label: "الرقم الوظيفي", 
        sortable: true,
        render: (value: any, row: AttendanceRecord) => row.employeeId 
      },
      { 
        key: "branch", 
        label: "الفرع", 
        sortable: true,
        render: (value: any, row: AttendanceRecord) => row.branch 
      },
      { 
        key: "department", 
        label: "الإدارة", 
        sortable: true,
        render: (value: any, row: AttendanceRecord) => row.department 
      },
      { 
        key: "approver", 
        label: "المعتمد", 
        sortable: true,
        render: (value: any, row: AttendanceRecord) => row.approver 
      },
      { 
        key: "employeeStatus", 
        label: "حالة الموظف", 
        sortable: true,
        render: (value: any, row: AttendanceRecord) => row.employeeStatus 
      },
      { 
        key: "attendanceStatus", 
        label: "حالة الحضور", 
        sortable: true,
        render: (value: any, row: AttendanceRecord) => <AttendanceStatusBadge status={row.attendanceStatus} /> 
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
