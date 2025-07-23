import { baseURL } from "@/config/axios-config";
import AttendanceStatusBadge from "../components/AttendanceDepartureTable/AttendanceStatusBadge";
import ApproverBadge from "../components/AttendanceDepartureTable/ApproverBadge";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import { AttendanceStatusRecord } from "../types/attendance";
import React from "react";
import { useTranslations } from "next-intl";
import { UN_SPECIFIED } from "../constants/static-data";

// Configuration function for the attendance departure table
export const getAttendanceDepartureTableConfig = (t: (key: string) => string) => {
  return {
    url: `${baseURL}/attendance/team`,
    tableId: "attendance-departure-table",
    columns: [
      {
        key: "user.name",
        label: t("columns.name"),
        sortable: true,
        searchable: true
      },
      {
        key: "work_date",
        label: t("columns.date"),
        sortable: true,
      },
      {
        key: "professional_data.job_code",
        label: t("columns.jobCode"),
        sortable: true
      },
      {
        key: "professional_data.branch",
        label: t("columns.branch"),
        sortable: true,
        searchable: true
      },
      {
        key: "professional_data.management",
        label: t("columns.management"),
        sortable: true,
        searchable: true
      },
      // {
      //   key: "clock_in_time",
      //   label: "وقت الحضور",
      //   sortable: true,
      //   render: (value: any, row: AttendanceStatusRecord) =>
      //     row.clock_in_time || "-",
      // },
      {
        key: "professional_data.attendance_constraint.constraint_name",
        label: t("columns.approver"),
        sortable: true,
        searchable: true,
        render: (value: any, row: AttendanceStatusRecord) => (
          <ApproverBadge
            approver={row?.professional_data?.attendance_constraint?.constraint_name ?? UN_SPECIFIED}
            record={row}
          />
        ),
      },
      {
        key: "is_late",
        label: t("columns.employeeStatus"),
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) =>
          row.is_late ? t("status.late") : t("status.onTime"),
      },
      {
        key: "status",
        label: t("columns.attendanceStatus"),
        sortable: true,
        render: (value: any, row: AttendanceStatusRecord) => (
          <AttendanceStatusBadge status={row.status} record={row} />
        ),
      },
    ] as ColumnConfig[],
    allSearchedFields: [
      {
        key: "search_text",
        searchType: {
          type: "text",
          placeholder: t("filters.searchPlaceholder"),
        },
      },
      {
        key: "branch_id",
        searchType: {
          type: "dropdown",
          placeholder: t("filters.branchPlaceholder"),
          dynamicDropdown: {
            url: `${baseURL}/management_hierarchies/list`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
          },
        },
      },
      {
        key: "management_id",
        searchType: {
          type: "dropdown",
          placeholder: t("filters.managementPlaceholder"),
          dynamicDropdown: {
            url: `${baseURL}/management_hierarchies/list`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
          },
        },
      },
      {
        key: "constraint_id",
        searchType: {
          type: "dropdown",
          placeholder: t("filters.constraintPlaceholder"),
          dynamicDropdown: {
            url: `${baseURL}/attendance/constraints`,
            valueField: "id",
            labelField: "constraint_name",
            searchParam: "constraint_name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
          },
        },
      },
      {
        key: "start_date",
        searchType: {
          type: "date",
          placeholder: t("columns.date"),
          defaultValue: new Date(),
        },
      },
      {
        key: "end_date",
        searchType: {
          type: "date",
          placeholder: t("columns.date"),
          defaultValue: new Date(),
        },
      },
    ],
    deleteConfirmMessage: t("deleteConfirm"),
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
