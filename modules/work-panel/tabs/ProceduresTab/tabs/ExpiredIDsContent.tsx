"use client";

import React from "react";
import { Box, Button, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useWorkPanelContext } from "@/modules/work-panel/context/WorkPanelContext";
import { InfoAlertApi } from "@/services/api/work-panel/info-alert";
import { InfoAlertItem } from "@/services/api/work-panel/info-alert/types/response";
import { downloadFromResponse } from "@/utils/downloadFromResponse";
import { useRouter } from "@i18n/navigation";

const QUERY_KEY = "expired-ids";

// Create typed table instance
const ExpiredIDsTable = HeadlessTableLayout<InfoAlertItem>("expired-ids");

// Column definitions
const getExpiredIDsColumns = (t: (key: string) => string) => [
  {
    key: "name",
    name: t("name"),
    sortable: false,
    render: (row: InfoAlertItem) => <span>{row.name}</span>,
  },
  {
    key: "entry_number",
    name: t("entryNumber"),
    sortable: false,
    render: (row: InfoAlertItem) => <span>{row.entry_number}</span>,
  },
  {
    key: "end_date",
    name: t("endDate"),
    sortable: false,
    render: (row: InfoAlertItem) => <span>{row.end_date}</span>,
  },
];

export default function ExpiredIDsContent() {
  const t = useTranslations("WorkPanel");
  const router = useRouter();
  const { verticalSection } = useWorkPanelContext();

  const branchId =
    verticalSection === "all-branches" ? undefined : verticalSection;

  // Table params
  const params = ExpiredIDsTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // Fetch data
  const { data: queryData, isLoading } = useQuery({
    queryKey: [QUERY_KEY, branchId, params.page, params.limit, params.search],
    queryFn: async () => {
      const response = await InfoAlertApi.list({
        type: "identity",
        ...(branchId && { branch_id: branchId }),
        ...(params.search && { search: params.search }),
      });

      const items = response.data.payload || [];
      const pagination = response.data.pagination;

      return {
        data: items,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? items.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  // Columns with actions
  const columns = [
    ...getExpiredIDsColumns(t),
    {
      key: "actions",
      name: t("actions"),
      sortable: false,
      render: (row: InfoAlertItem) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("actions")}</Button>
          )}
        >
          <MenuItem
            onClick={() => {
              router.push(`/user-profile/${row.id}`);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {t("edit")}
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // Table state
  const state = ExpiredIDsTable.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: InfoAlertItem) => row.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
    onExport: async () => {
      downloadFromResponse(await InfoAlertApi.export());
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <ExpiredIDsTable
        filters={
          <ExpiredIDsTable.TopActions state={state}>
          </ExpiredIDsTable.TopActions>
        }
        table={
          <ExpiredIDsTable.Table state={state} loadingOptions={{ rows: 5 }} />
        }
        pagination={<ExpiredIDsTable.Pagination state={state} />}
      />
    </Box>
  );
}
