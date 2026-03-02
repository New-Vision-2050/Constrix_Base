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
import { CustomerRequestsApi } from "@/services/api/customer-requests";
import { CustomerRequestRow, getCustomerRequestsColumns } from "./columns";
import { RequestFormDrawer } from "./components/RequestFormDrawer";
import { statisticsConfig } from "./components/statistics-config";
const CUSTOMER_REQUESTS_QUERY_KEY = "customer-requests-list";

const CustomerRequestsTableLayout =
  HeadlessTableLayout<CustomerRequestRow>("crl");

export default function CustomerRequestsList() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterRequestType, setFilterRequestType] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = CustomerRequestsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      CUSTOMER_REQUESTS_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
      filterStatus,
      filterRequestType,
      filterEmployee,
    ],
    queryFn: async () => {
      const response = await CustomerRequestsApi.list({
        page: params.page,
        per_page: params.limit,
        ...(params.search ? { search: params.search } : {}),
        ...(filterStatus ? { status_client_request: filterStatus } : {}),
        ...(filterRequestType
          ? { client_request_type_id: filterRequestType }
          : {}),
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
    ...getCustomerRequestsColumns(t),
    {
      key: "actions",
      name: t("customerRequests.table.actions"),
      sortable: false,
      render: (row: CustomerRequestRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>
              {t("customerRequests.table.actions")}
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
  const state = CustomerRequestsTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: CustomerRequestRow) => String(row.id),
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
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: "end" }}
          >
            {t("customerRequests.filter.title")}
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
                {t("customerRequests.filter.responsibleEmployee")}
              </InputLabel>
              <Select
                value={filterEmployee}
                label={t("customerRequests.filter.responsibleEmployee")}
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <MenuItem value="">{t("customerRequests.filter.all")}</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>
                {t("customerRequests.filter.requestStatus")}
              </InputLabel>
              <Select
                value={filterStatus}
                label={t("customerRequests.filter.requestStatus")}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">{t("customerRequests.filter.all")}</MenuItem>
                <MenuItem value="pending">
                  {t("customerRequests.status.pending")}
                </MenuItem>
                <MenuItem value="in_progress">
                  {t("customerRequests.status.inProgress")}
                </MenuItem>
                <MenuItem value="approved">
                  {t("customerRequests.status.approved")}
                </MenuItem>
                <MenuItem value="rejected">
                  {t("customerRequests.status.rejected")}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>
                {t("customerRequests.filter.customerName")}
              </InputLabel>
              <Select
                value={filterCustomerName}
                label={t("customerRequests.filter.customerName")}
                onChange={(e) => setFilterCustomerName(e.target.value)}
              >
                <MenuItem value="">{t("customerRequests.filter.all")}</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>
                {t("customerRequests.filter.requestType")}
              </InputLabel>
              <Select
                value={filterRequestType}
                label={t("customerRequests.filter.requestType")}
                onChange={(e) => setFilterRequestType(e.target.value)}
              >
                <MenuItem value="">{t("customerRequests.filter.all")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table */}
        <CustomerRequestsTableLayout
          filters={
            <CustomerRequestsTableLayout.TopActions
              state={state}
              customActions={
                <Button variant="contained" onClick={handleAddNew}>
                  {t("customerRequests.addRequest")}
                </Button>
              }
            />
          }
          table={
            <CustomerRequestsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<CustomerRequestsTableLayout.Pagination state={state} />}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteButton
          message={t("customerRequests.deleteConfirm")}
          onDelete={async () => {
            if (!deletingRequestId) return;
            await CustomerRequestsApi.delete(deletingRequestId);
            queryClient.invalidateQueries({
              queryKey: [CUSTOMER_REQUESTS_QUERY_KEY],
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
          queryKey={CUSTOMER_REQUESTS_QUERY_KEY}
        />
      </Box>
    </>
  );
}
