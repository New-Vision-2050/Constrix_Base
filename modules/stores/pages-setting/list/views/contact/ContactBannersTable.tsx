"use client";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Box, Stack, Grid, TextField, Button, MenuItem } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { ContactDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import withPermissions from "@/lib/permissions/client/withPermissions";
import HeadlessTableLayout from "@/components/headless/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/shared/delete-button";
import CustomMenu from "@/components/headless/custom-menu";
import { EditIcon, Trash2 } from "lucide-react";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { BannersRow } from "./types/banners-types";
import { getBannersColumns } from "./columns/banners-columns";
import { BannersApi } from "@/services/api/ecommerce/pages-setting/contact/banners";

const CONTACT_BANNERS_QUERY_KEY = "pages-setting-contact-banners";

// Create typed table instance
const ContactBannersTableLayout = HeadlessTableLayout<BannersRow>();

function ContactBannersTable() {
  const t = useTranslations("pagesSettings");
  const tCommon = useTranslations("labels");
  const queryClient = useQueryClient();
  const { can } = usePermissions();

  // Edit dialog state
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Delete dialog state
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = ContactBannersTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ✅ STEP 2: Fetch data using useQuery
  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      CONTACT_BANNERS_QUERY_KEY,
      params.page,
      params.limit,
      searchQuery,
    ],
    queryFn: async () => {
      const response = await BannersApi.list({
        type: "contact_us",
        page: params.page,
        per_page: params.limit,
        search: searchQuery,
      });

      return {
        data: response.data.payload || [],
        totalPages: response.data.pagination?.last_page ?? 1,
        totalItems:
          response.data.pagination?.result_count ??
          (response.data.payload || []).length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  // Define columns
  const columns = [
    ...getBannersColumns(t, can),
    {
      key: "actions",
      name: tCommon("actions"),
      sortable: false,
      render: (row: BannersRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{tCommon("actions")}</Button>
          )}
        >
          <MenuItem
            onClick={() => {
              setEditingPageId(row.id);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {tCommon("edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingPageId(row.id);
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {tCommon("delete")}
          </MenuItem>
        </CustomMenu>
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = ContactBannersTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (page: BannersRow) => page.id,
    loading: isLoading,
    filtered: searchQuery !== "",
  });

  const handleAddPage = () => {
    setEditingPageId("new");
  };

  return (
    <>
      <Box>
        <ContactBannersTableLayout
          filters={
            <Stack spacing={2}>
              {/* Filter Controls */}
              <Grid container spacing={2}>
                <Grid size={{ md: 10 }}>
                  <TextField
                    size="small"
                    placeholder={tCommon("search")}
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
                  <Can check={[PERMISSIONS.ecommerce.banner.create]}>
                    <Button
                      variant="contained"
                      onClick={handleAddPage}
                      fullWidth
                    >
                      {t("actions.addBanner")}
                    </Button>
                  </Can>
                </Grid>
              </Grid>
            </Stack>
          }
          table={
            <ContactBannersTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<ContactBannersTableLayout.Pagination state={state} />}
        />
      </Box>

      {/* Add/Edit Page Dialog */}
      <Can check={[PERMISSIONS.ecommerce.banner.update]}>
        <ContactDialog
          open={Boolean(editingPageId)}
          onClose={() => setEditingPageId(null)}
          pageId={
            editingPageId === "new" ? undefined : (editingPageId ?? undefined)
          }
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [CONTACT_BANNERS_QUERY_KEY],
            });
            setEditingPageId(null);
          }}
        />
      </Can>

      {/* Delete Confirmation Dialog */}
      <DeleteButton
        message={t("confirmations.delete")}
        onDelete={async () => {
          if (deletingPageId) {
            await BannersApi.delete(deletingPageId);
            queryClient.invalidateQueries({
              queryKey: [CONTACT_BANNERS_QUERY_KEY],
            });
          }
          setDeleteDialogOpen(false);
          setDeletingPageId(null);
        }}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        translations={{
          deleteSuccess: tCommon("deleteSuccess"),
          deleteError: tCommon("deleteError"),
          deleteCancelled: tCommon("deleteCancelled"),
        }}
      />
    </>
  );
}

export default withPermissions(ContactBannersTable, [
  PERMISSIONS.ecommerce.banner.list,
]);
