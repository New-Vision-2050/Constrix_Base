"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { EyeIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
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
import { ClientRequestRow, getClientRequestsColumns } from "./columns";
import { statisticsConfig } from "./components/statistics-config";
import { RequestFormDrawer } from "./components/RequestFormDrawer";
import { ClientRequestsApi } from "@/services/api/client-requests";
import { CRM_INBOX_PENDING_COUNT_QUERY_KEY } from "@/components/icons/crm-inbox";
import { CRM_INBOX_LIST_QUERY_KEY } from "@/modules/crm-settings/query-keys";
import CrmInboxDetailsDialog from "@/modules/crm-settings/inbox/components/CrmInboxDetailsDialog";

const CLIENT_REQUESTS_QUERY_KEY = "client-requests-list";

const ClientRequestsTableLayout = HeadlessTableLayout<ClientRequestRow>("crl");

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

function ClientRequestsList() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canUpdateClientRequest = can(PERMISSIONS.clientRequest.update);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRow, setDetailsRow] = useState<ClientRequestRow | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClientName, setFilterClientName] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("");

  const { data: requestTypesData } = useQuery({
    queryKey: ["client-request-types"],
    queryFn: () =>
      ClientRequestsApi.getRequestTypes().then((r) => r.data.payload ?? []),
    staleTime: Infinity,
  });

  const { data: clientsData } = useQuery({
    queryKey: ["client-request-clients"],
    queryFn: () =>
      ClientRequestsApi.getClients().then((r) => r.data.payload ?? []),
    staleTime: Infinity,
  });

  const params = ClientRequestsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      CLIENT_REQUESTS_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
      filterStatus,
      filterRequestType,
      filterClientName,
    ],
    queryFn: async () => {
      const response = await ClientRequestsApi.list({
        page: params.page,
        per_page: params.limit,
        ...(params.search ? { search: params.search } : {}),
        ...(filterStatus ? { status_client_request: filterStatus } : {}),
        ...(filterRequestType
          ? { client_request_type_id: filterRequestType }
          : {}),
        ...(filterClientName ? { client_id: filterClientName } : {}),
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

  const handleAddNew = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const invalidateClientRequestsList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [CLIENT_REQUESTS_QUERY_KEY] });
    queryClient.invalidateQueries({
      queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY,
    });
    queryClient.invalidateQueries({ queryKey: [CRM_INBOX_LIST_QUERY_KEY] });
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
      invalidateClientRequestsList();
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorDescription(error) ??
          t("clientRequests.inbox.toastOperationError"),
      );
    },
  });

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
        render: (row: ClientRequestRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button onClick={onClick} disabled={pendingStatusAction}>
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
        ),
      },
    ],
    [openDetails, pendingStatusAction, t],
  );

  const state = ClientRequestsTableLayout.useTableState({
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
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
            {t("clientRequests.filter.title")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
            }}
          >
            <FormControl size="small" fullWidth>
              <InputLabel>
                {t("clientRequests.filter.requestStatus")}
              </InputLabel>
              <Select
                value={filterStatus}
                label={t("clientRequests.filter.requestStatus")}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">{t("clientRequests.filter.all")}</MenuItem>
                <MenuItem value="pending">
                  {t("clientRequests.status.pending")}
                </MenuItem>
                <MenuItem value="in_progress">
                  {t("clientRequests.status.inProgress")}
                </MenuItem>
                <MenuItem value="approved">
                  {t("clientRequests.status.approved")}
                </MenuItem>
                <MenuItem value="rejected">
                  {t("clientRequests.status.rejected")}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>{t("clientRequests.filter.customerName")}</InputLabel>
              <Select
                value={filterClientName}
                label={t("clientRequests.filter.customerName")}
                onChange={(e) => setFilterClientName(e.target.value)}
              >
                <MenuItem value="">{t("clientRequests.filter.all")}</MenuItem>
                {clientsData?.map((client) => (
                  <MenuItem key={client.id} value={String(client.id)}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>{t("clientRequests.filter.requestType")}</InputLabel>
              <Select
                value={filterRequestType}
                label={t("clientRequests.filter.requestType")}
                onChange={(e) => setFilterRequestType(e.target.value)}
              >
                <MenuItem value="">{t("clientRequests.filter.all")}</MenuItem>
                {requestTypesData?.map(
                  (type: { id: string | number; name: string }) => (
                    <MenuItem key={type.id} value={String(type.id)}>
                      {type.name}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <ClientRequestsTableLayout
          filters={
            <ClientRequestsTableLayout.TopActions
              state={state}
              customActions={
                <Can check={[PERMISSIONS.clientRequest.create]}>
                  <Button variant="contained" onClick={handleAddNew}>
                    {t("clientRequests.addRequest")}
                  </Button>
                </Can>
              }
            />
          }
          table={
            <ClientRequestsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<ClientRequestsTableLayout.Pagination state={state} />}
        />

        <Can check={[PERMISSIONS.clientRequest.delete]}>
          <DeleteButton
            message={t("clientRequests.deleteConfirm")}
            onDelete={async () => {
              if (!deletingRequestId) return;
              await ClientRequestsApi.delete(deletingRequestId);
              invalidateClientRequestsList();
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

        <RequestFormDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          queryKey={CLIENT_REQUESTS_QUERY_KEY}
        />

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

export default ClientRequestsList;
