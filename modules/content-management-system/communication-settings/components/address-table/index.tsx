"use client";
import { useMemo, useState } from "react";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import SetAddressDialog from "./SetAddressDialog";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { Address } from "@/services/api/company-dashboard/communication-settings/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommunicationSettingsAddressesApi } from "@/services/api/company-dashboard/communication-settings/addresses";
import { getAddressColumns } from "./columns";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import CustomMenu from "@/components/headless/custom-menu";
import { baseURL } from "@/config/axios-config";
import { EditIcon, Trash2 } from "lucide-react";
import { downloadFromResponse } from "@/utils/downloadFromResponse";
import withPermissions from "@/lib/permissions/client/withPermissions";
import Can from "@/lib/permissions/client/Can";

const ADDRESSES_QUERY_KEY = "communication-settings-addresses";

// Create typed table instance
const AddressTableLayout = HeadlessTableLayout<Address>("csad");

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
  // Fetch data using query
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] });
  };

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = AddressTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "title",
    initialSortDirection: "asc",
  });

  // ✅ STEP 2: Fetch data using useQuery directly
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      ADDRESSES_QUERY_KEY,
      params.page,
      params.limit,
      params.sortBy,
      params.sortDirection,
      params.search,
    ],
    queryFn: async () => {
      const response = await CommunicationSettingsAddressesApi.getAll({
        page: params.page,
        per_page: params.limit,
        sort_by: params.sortBy,
        sort_direction: params.sortDirection,
        title: params.search,
      });

      return response.data;
    },
  });

  // Extract data from response
  const addresses = useMemo<Address[]>(() => data?.payload || [], [data]);
  const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);
  const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

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
    data: addresses,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (address: Address) => address.id,
    loading: isLoading,
    searchable: true,
    onExport: async () => {
      downloadFromResponse(await CommunicationSettingsAddressesApi.export());
    },
  });

  return (
    <Box py={2}>
      <Typography variant="h6" sx={{ my: 4 }}>
        {t("table.title")}
      </Typography>
      <AddressTableLayout
        filters={
          <AddressTableLayout.TopActions
            state={state}
            customActions={
              <Can
                check={[PERMISSIONS.CMS.communicationSettings.addresses.create]}
              >
                <DialogTrigger
                  component={SetAddressDialog}
                  dialogProps={{
                    onSuccess: () => {
                      refetch();
                    },
                  }}
                  render={({ onOpen }) => (
                    <Button variant="contained" onClick={onOpen}>
                      {t("table.addAddress")}
                    </Button>
                  )}
                />
              </Can>
            }
          >
            {/* Add address button */}
          </AddressTableLayout.TopActions>
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
