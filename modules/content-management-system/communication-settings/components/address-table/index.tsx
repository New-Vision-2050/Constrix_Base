"use client";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import SetAddressDialog from "./SetAddressDialog";
import DialogTrigger from "@/components/headless/dialog-trigger";
import {
  Box,
  Stack,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { Address } from "@/services/api/company-dashboard/communication-settings/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommunicationSettingsAddressesApi } from "@/services/api/company-dashboard/communication-settings/addresses";
import { getAddressColumns } from "./columns";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import CustomMenu from "@/components/headless/custom-menu";
import { baseURL } from "@/config/axios-config";
import { EditIcon, Trash2 } from "lucide-react";
import withPermissions from "@/lib/permissions/client/withPermissions";

const ADDRESSES_QUERY_KEY = "communication-settings-addresses";

// Create typed table instance
const AddressTableLayout = HeadlessTableLayout<Address>();

function AddressTable() {
  const t = useTranslations("content-management-system.communicationSetting");
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<
    string | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<
    string | undefined
  >();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data using query
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] });
  };

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = AddressTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 5,
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [ADDRESSES_QUERY_KEY, params.page, params.limit, searchQuery],
    queryFn: async () => {
      const response = await CommunicationSettingsAddressesApi.getAll({
        page: params.page,
        per_page: params.limit,
        title: searchQuery || undefined,
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
  const columns = [
    ...getAddressColumns(t),
    {
      key: "actions",
      name: t("table.actions"),
      sortable: false,
      render: (row: Address) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("table.actions")}</Button>
          )}
        >
          <MenuItem
            onClick={() => {
              setEditingAddressId(row.id);
              setEditDialogOpen(true);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {t("table.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingAddressId(row.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {t("table.delete")}
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

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
  });

  return (
    <Box py={2}>
      <AddressTableLayout
        filters={
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ my: 4 }}>
              {t("table.title")}
            </Typography>
            {/* Filter Controls */}
            <Grid container spacing={2}>
              <Grid size={{ md: 10 }}>
                <TextField
                  size="small"
                  placeholder={t("table.search")}
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
                  fullWidth
                />
              </Grid>
              <Grid size={{ md: 2 }}>
                <Can
                  check={[
                    PERMISSIONS.CMS.communicationSettings.addresses.create,
                  ]}
                >
                  <DialogTrigger
                    component={SetAddressDialog}
                    dialogProps={{ onSuccess: () => invalidate() }}
                    render={({ onOpen }) => (
                      <Button variant="contained" onClick={onOpen} fullWidth>
                        {t("table.addAddress")}
                      </Button>
                    )}
                  />
                </Can>
              </Grid>
            </Grid>
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

      {/* Edit Dialog */}
      <SetAddressDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingAddressId(undefined);
        }}
        onSuccess={() => {
          invalidate();
          setEditDialogOpen(false);
          setEditingAddressId(undefined);
        }}
        addressId={editingAddressId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        deleteUrl={`${baseURL}/website-addresses/${deletingAddressId}`}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingAddressId(undefined);
        }}
        open={deleteDialogOpen}
        onSuccess={() => {
          invalidate();
          setDeleteDialogOpen(false);
          setDeletingAddressId(undefined);
        }}
      />
    </Box>
  );
}

export default withPermissions(AddressTable, [
  PERMISSIONS.CMS.communicationSettings.addresses.list,
]);
