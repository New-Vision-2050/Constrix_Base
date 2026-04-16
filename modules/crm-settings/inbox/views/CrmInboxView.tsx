"use client";

import { useCallback, useMemo, useState } from "react";
import { Box, Button, MenuItem } from "@mui/material";
import { EyeIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import DeleteButton from "@/components/shared/delete-button";
import Can from "@/lib/permissions/client/Can";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
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
import CrmInboxDetailsDialog from "@/modules/crm-settings/inbox/components/CrmInboxDetailsDialog";

const CrmInboxTableLayout = HeadlessTableLayout<ClientRequestRow>("crm-inbox");

function getApiErrorDescription(error: unknown): string | undefined {
  const data = axios.isAxiosError(error)
    ? error.response?.data
    : (error as { response?: { data?: unknown } })?.response?.data;
  if (!data || typeof data !== "object") return undefined;
  const body = data as { description?: string; message?: unknown };
  if (typeof body.description === "string" && body.description.trim())
    return body.description.trim();
  if (typeof body.message === "string") return body.message;
  return undefined;
}

function CrmInboxView() {
  const t = useTranslations();
  const { can } = usePermissions();
  const queryClient = useQueryClient();
  const canUpdateClientRequest = can(PERMISSIONS.clientRequest.update);

  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRow, setDetailsRow] = useState<ClientRequestRow | null>(null);

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

  const invalidateInbox = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [CRM_INBOX_LIST_QUERY_KEY] });
    queryClient.invalidateQueries({
      queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY,
    });
  }, [queryClient]);

  const statusMutation = useMutation({
    mutationFn: (vars: {
      id: string;
      status: "accepted" | "rejected";
      reject_cause?: string;
    }) =>
      vars.status === "accepted"
        ? ClientRequestsApi.updateStatus(vars.id, {
            status_client_request: "accepted",
          })
        : ClientRequestsApi.updateStatus(vars.id, {
            status_client_request: "rejected",
            reject_cause: vars.reject_cause ?? "",
          }),
    onSuccess: (_data, vars) => {
      toast.success(
        vars.status === "accepted"
          ? t("clientRequests.inbox.toastAcceptSuccess")
          : t("clientRequests.inbox.toastRejectSuccess"),
      );
      invalidateInbox();
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorDescription(error) ??
          t("clientRequests.inbox.toastOperationError"),
      );
    },
  });

  const data = queryData?.data ?? [];
  const totalPages = queryData?.totalPages ?? 1;
  const totalItems = queryData?.totalItems ?? 0;

  const pendingStatusAction = statusMutation.isPending;

  const openDetails = useCallback((row: ClientRequestRow) => {
    setDetailsRow(row);
    setDetailsOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setDetailsRow(null);
  }, []);

  const detailsCanRespond =
    String(detailsRow?.status_client_request ?? "")
      .trim()
      .toLowerCase() === "pending";

  const columns = useMemo(
    () => [
      ...getClientRequestsColumns(t),
      {
        key: "actions",
        name: t("clientRequests.table.actions"),
        sortable: false,
        render: (row: ClientRequestRow) => {
          return (
            <CustomMenu
              renderAnchor={({ onClick }) => (
                <Button
                  onClick={onClick}
                  disabled={pendingStatusAction}
                >
                  {t("clientRequests.table.actions")}
                </Button>
              )}
            >
              <MenuItem
                onClick={() => openDetails(row)}
                disabled={pendingStatusAction}
              >
                <EyeIcon className="w-4 h-4 ml-2" />
                {t("clientRequests.inbox.viewDetails")}
              </MenuItem>
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
          );
        },
      },
    ],
    [openDetails, pendingStatusAction, t],
  );

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
              invalidateInbox();
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

        <CrmInboxDetailsDialog
          open={detailsOpen}
          onClose={closeDetails}
          row={detailsRow}
          canRespond={detailsCanRespond}
          canUpdateStatus={canUpdateClientRequest}
          actionPending={pendingStatusAction}
          onAccept={() => {
            if (!detailsRow) return;
            statusMutation.mutate(
              { id: detailsRow.id, status: "accepted" },
              { onSuccess: () => closeDetails() },
            );
          }}
          onReject={(rejectCause) => {
            if (!detailsRow) return;
            statusMutation.mutate(
              {
                id: detailsRow.id,
                status: "rejected",
                reject_cause: rejectCause,
              },
              { onSuccess: () => closeDetails() },
            );
          }}
        />
      </Box>
    </>
  );
}

export default withPermissions(CrmInboxView, [PERMISSIONS.clientRequest.list]);
