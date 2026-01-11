"use client";
import { useEffect, useMemo, useState } from "react";
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

  const { data: addressesData, isLoading: isFetchingAddresses } = useQuery({
    queryKey: [ADDRESSES_QUERY_KEY],
    queryFn: async () => {
      const response = await CommunicationSettingsAddressesApi.getAll();
      return response.data.payload;
    },
  });

  const addresses = useMemo(() => addressesData ?? [], [addressesData]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] });
  };

  const [tableData, setTableData] = useState<Address[]>([]);

  useEffect(() => {
    setTableData(addresses);
  }, [addresses]);

  // Filter data based on search and role
  const filteredAddresses = tableData.filter((address) => {
    const matchesSearch =
      address.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (address.address ?? "-")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Define columns
  const columns = getAddressColumns(t);

  // Initialize table state
  const state = AddressTableLayout.useState({
    data: filteredAddresses,
    columns,
    selectable: true,
    getRowId: (address) => address.id,
    loading: isFetchingAddresses,
    filtered: searchQuery !== "",
    onExport: async (selectedRows) => {
      console.log("Exporting rows:", selectedRows);
      alert(`Exporting ${selectedRows.length} rows`);
    },
    onDelete: async (selectedRows) => {
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
