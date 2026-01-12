"use client";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import SetAddressDialog from "./SetAddressDialog";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { Box, Stack, TextField, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import withPermissions from "@/lib/permissions/client/withPermissions";
import HeadlessTableLayout from "@/components/headless/table";
import { Address } from "@/services/api/company-dashboard/communication-settings/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommunicationSettingsAddressesApi } from "@/services/api/company-dashboard/communication-settings/addresses";
import { getAddressColumns } from "./columns";

const ADDRESSES_QUERY_KEY = "communication-settings-addresses";

// Create typed table instance
const AddressTableLayout = HeadlessTableLayout<Address>();

function AddressTable() {
  const t = useTranslations(
    "content-management-system.communicationSetting.table"
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch data using query
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] });
  };

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = AddressTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 5,
    initialSortBy: "title",
    initialSortDirection: "asc",
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      ADDRESSES_QUERY_KEY,
      params.page,
      params.limit,
      searchQuery,
      statusFilter,
    ],
    queryFn: async () => {
      const response = await CommunicationSettingsAddressesApi.getAll({
        page: params.page,
        per_page: params.limit,
        title: searchQuery || undefined,
        status: statusFilter !== "all" ? Number(statusFilter) : undefined,
      });

      const data = response.data.payload ?? [];
      const pagination = response.data.pagination;

      return {
        data,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? data.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  // Define columns
  const columns = getAddressColumns(t);

  // ✅ STEP 3: useTableState (AFTER query)
  const state = AddressTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (address: Address) => address.id,
    loading: isLoading,
    filtered: searchQuery !== "" || statusFilter !== "all",
    onExport: async (selectedRows: Address[]) => {
      console.log("Exporting rows:", selectedRows);
      alert(`Exporting ${selectedRows.length} rows`);
    },
    onDelete: async (selectedRows: Address[]) => {
      console.log("Deleting rows:", selectedRows);
      alert(`Deleting ${selectedRows.length} rows`);
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <AddressTableLayout
        filters={
          <Stack spacing={2}>
            {/* Filter Controls */}
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  params.setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  params.setPage(1);
                }}
                SelectProps={{ native: true }}
                sx={{ minWidth: 150 }}
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </TextField>
            </Stack>

            {/* Top Actions */}
            <AddressTableLayout.TopActions
              state={state}
              customActions={
                <Stack direction="row" spacing={1}>
                  <Can
                    check={[
                      PERMISSIONS.CMS.communicationSettings.addresses.create,
                    ]}
                  >
                    <DialogTrigger
                      component={SetAddressDialog}
                      dialogProps={{ onSuccess: () => invalidate() }}
                      render={({ onOpen }) => (
                        <Button variant="contained" onClick={onOpen}>
                          {t("addAddress")}
                        </Button>
                      )}
                    />
                  </Can>
                </Stack>
              }
            />
          </Stack>
        }
        table={
          <AddressTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<AddressTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}

export default withPermissions(AddressTable, [
  PERMISSIONS.CMS.communicationSettings.addresses.list,
]);
