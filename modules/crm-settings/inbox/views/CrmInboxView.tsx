"use client";

import { useState } from "react";
import { Box, Button, MenuItem } from "@mui/material";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import DeleteButton from "@/components/shared/delete-button";
import Can from "@/lib/permissions/client/Can";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import {
  ClientRequestRow,
  getClientRequestsColumns,
} from "@/modules/crm-settings/client-requests/views/list/columns";
import { statisticsConfig } from "@/modules/crm-settings/client-requests/views/list/components/statistics-config";
import { ClientRequestsApi } from "@/services/api/client-requests";
import { CRM_INBOX_PENDING_COUNT_QUERY_KEY } from "@/components/icons/crm-inbox";
import { CRM_INBOX_LIST_QUERY_KEY } from "@/modules/crm-settings/query-keys";

const CrmInboxTableLayout = HeadlessTableLayout<ClientRequestRow>("crm-inbox");

function CrmInboxView() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const params = CrmInboxTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      CRM_INBOX_LIST_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
    ],
    queryFn: async () => {
      const response = await ClientRequestsApi.list({
        page: params.page,
        per_page: params.limit,
        status_client_request: "pending",
        ...(params.search ? { search: params.search } : {}),
      });
      const payload = response.data.payload ?? [];
      const pagination = response.data.pagination;
      return {
        data: payload,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? payload.length,
      };
    },
  });

  const data = queryData?.data ?? [];
  const totalPages = queryData?.totalPages ?? 1;
  const totalItems = queryData?.totalItems ?? 0;

  const columns = [
    ...getClientRequestsColumns(t),
    {
      key: "actions",
      name: t("clientRequests.table.actions"),
      sortable: false,
      render: (row: ClientRequestRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>
              {t("clientRequests.table.actions")}
            </Button>
          )}
        >
          <Can check={[PERMISSIONS.clientRequest.delete]}>
            <MenuItem
              onClick={() => {
                setDeletingRequestId(row.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4 ml-2" />
              {t("labels.delete")}
            </MenuItem>
          </Can>
        </CustomMenu>
      ),
    },
  ];

  const state = CrmInboxTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ClientRequestRow) => String(row.id),
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <>
      <StatisticsStoreRow config={statisticsConfig} />
      <Box sx={{ p: 3 }}>
        <CrmInboxTableLayout
          filters={
            <CrmInboxTableLayout.TopActions state={state} customActions={null} />
          }
          table={
            <CrmInboxTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<CrmInboxTableLayout.Pagination state={state} />}
        />

        <Can check={[PERMISSIONS.clientRequest.delete]}>
          <DeleteButton
            message={t("clientRequests.deleteConfirm")}
            onDelete={async () => {
              if (!deletingRequestId) return;
              await ClientRequestsApi.delete(deletingRequestId);
              queryClient.invalidateQueries({
                queryKey: [CRM_INBOX_LIST_QUERY_KEY],
              });
              queryClient.invalidateQueries({
                queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY,
              });
              setDeleteDialogOpen(false);
              setDeletingRequestId(null);
            }}
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            translations={{
              deleteSuccess: t("labels.deleteSuccess"),
              deleteError: t("labels.deleteError"),
              deleteCancelled: t("labels.deleteCancelled"),
            }}
          />
        </Can>
      </Box>
    </>
  );
}

export default withPermissions(CrmInboxView, [PERMISSIONS.clientRequest.list]);
