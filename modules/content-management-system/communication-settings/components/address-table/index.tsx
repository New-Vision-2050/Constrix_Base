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
      params.sortBy,
      params.sortDirection,
      searchQuery,
    ],
    queryFn: async () => {
      const response = await CommunicationSettingsAddressesApi.getAll();
      const allData = response.data.payload ?? [];

      // Filter data based on search and role
      const filtered = allData.filter((address: Address) => {
        const matchesSearch =
          !searchQuery ||
          address.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (address.address ?? "-")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchesSearch;
      });

      // Sort
      if (params.sortBy) {
        filtered.sort((a: Address, b: Address) => {
          const aVal = a[params.sortBy as keyof Address];
          const bVal = b[params.sortBy as keyof Address];
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return params.sortDirection === "desc" ? -comparison : comparison;
        });
      }

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / params.limit);
      const startIndex = (params.page - 1) * params.limit;
      const paginatedData = filtered.slice(
        startIndex,
        startIndex + params.limit
      );

      return { data: paginatedData, totalPages, totalItems };
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
    filtered: searchQuery !== "",
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
