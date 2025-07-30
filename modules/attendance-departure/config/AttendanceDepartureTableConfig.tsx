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
      {
        key: "professional_data.attendance_constraint",
        label: t("columns.approver"),
        sortable: true,
        searchable: true,
        render: (value: any, row: AttendanceStatusRecord) => (
          <ApproverBadge
            approver={row?.status }
            record={row}
          />
        ),
      },
      {
        key: "day_status",
        label: t("columns.employeeStatus"),
        sortable: true,
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
        label: t("filters.searchText"), // مثال لحقل مع label
        searchType: {
          type: "text",
          placeholder: t("filters.searchPlaceholder"),
        },
      },
      {
        key: "branch_id",
        label: t("filters.branch"),
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
        label: t("filters.management"),
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
        label: t("filters.constraint"),
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
        label: t("filters.startDate"),
        searchType: {
          type: "date",
          placeholder: t("columns.date"),
          defaultValue: new Date(),
          minDate: new Date('1900-01-01'), // Set minDate to January 1, 1900
          maxDateField: "end_date", // Set end_date field as the maximum date constraint
        },
      },
      {
        key: "end_date",
        label: t("filters.endDate"),
        searchType: {
          type: "date",
          placeholder: t("columns.date"),
          defaultValue: new Date(),
          minDateField: "start_date", // Set start_date field as the minimum date constraint
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
      canDelete: true,
    },
  };
};
