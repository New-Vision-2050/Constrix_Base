"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import DeleteButton from "@/components/shared/delete-button";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import { ClientRequestRow, getClientRequestsColumns } from "./columns";
import { statisticsConfig } from "./components/statistics-config";
import { RequestFormDrawer } from "./components/RequestFormDrawer";
import { ClientRequestsApi } from "@/services/api/client-requests";
const CLIENT_REQUESTS_QUERY_KEY = "client-requests-list";

const ClientRequestsTableLayout = HeadlessTableLayout<ClientRequestRow>("crl");

export default function ClientRequestsList() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClientName, setFilterClientName] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");

  // Filter data queries
  const { data: requestTypesData } = useQuery({
    queryKey: ["client-request-types"],
    queryFn: () =>
      ClientRequestsApi.getRequestTypes().then((r) => r.data.payload ?? []),
    staleTime: Infinity,
  });

  const { data: sourcesData } = useQuery({
    queryKey: ["client-request-sources"],
    queryFn: () =>
      ClientRequestsApi.getSources().then((r) => r.data.payload ?? []),
    staleTime: Infinity,
  });

  const { data: clientsData } = useQuery({
    queryKey: ["client-request-clients"],
    queryFn: () =>
      ClientRequestsApi.getClients().then((r) => r.data.payload ?? []),
    staleTime: Infinity,
  });

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = ClientRequestsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      CLIENT_REQUESTS_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
      filterStatus,
      filterRequestType,
      filterEmployee,
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
        ...(filterEmployee
          ? { client_request_receiver_from_id: filterEmployee }
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

  // Define columns
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
          <MenuItem
            onClick={() => {
              setDeletingRequestId(row.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {t("labels.delete")}
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
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
        {/* Filter Section */}
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
            {/* <FormControl size="small" fullWidth>
              <InputLabel>
                {t("clientRequests.filter.responsibleEmployee")}
              </InputLabel>
              <Select
                value={filterEmployee}
                label={t("clientRequests.filter.responsibleEmployee")}
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <MenuItem value="">{t("clientRequests.filter.all")}</MenuItem>
                {sourcesData?.map((source) => (
                  <MenuItem key={source.id} value={String(source.id)}>
                    {source.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

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
                {requestTypesData?.map((type) => (
                  <MenuItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table */}
        <ClientRequestsTableLayout
          filters={
            <ClientRequestsTableLayout.TopActions
              state={state}
              customActions={
                <Button variant="contained" onClick={handleAddNew}>
                  {t("clientRequests.addRequest")}
                </Button>
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

        {/* Delete Confirmation Dialog */}
        <DeleteButton
          message={t("clientRequests.deleteConfirm")}
          onDelete={async () => {
            if (!deletingRequestId) return;
            await ClientRequestsApi.delete(deletingRequestId);
            queryClient.invalidateQueries({
              queryKey: [CLIENT_REQUESTS_QUERY_KEY],
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

        {/* Add/Edit Drawer */}
        <RequestFormDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          queryKey={CLIENT_REQUESTS_QUERY_KEY}
        />
      </Box>
    </>
  );
}
