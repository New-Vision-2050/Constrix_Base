"use client";

import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Box, Stack, Grid, TextField, Button, MenuItem } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { OfferDialog } from "@/modules/stores/components/dialogs/add-coupons";
import HeadlessTableLayout from "@/components/headless/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/shared/delete-button";
import CustomMenu from "@/components/headless/custom-menu";
import { EditIcon, Trash2 } from "lucide-react";
import { OfferRow, getOfferColumns } from "./columns";
import { FlashDealsApi } from "@/services/api/ecommerce/flash-deals";

const OFFERS_QUERY_KEY = "offers-list";

const OffersTableLayout = HeadlessTableLayout<OfferRow>();

function OfferView() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const params = OffersTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryData, isLoading } = useQuery({
    queryKey: [OFFERS_QUERY_KEY, params.page, params.limit, searchQuery],
    queryFn: async () => {
      const response = await FlashDealsApi.list({
        search: searchQuery,
        page: params.page,
        per_page: params.limit,
      });

      const offers = (response.data.payload as OfferRow[]) || [];
      const pagination = response.data.pagination;

      return {
        data: offers,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? offers.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  const columns = [
    ...getOfferColumns(t),
    {
      key: "actions",
      name: t("labels.actions"),
      sortable: false,
      render: (row: OfferRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("labels.actions")}</Button>
          )}
        >
          <MenuItem onClick={() => setEditingOfferId(row.id)}>
            <EditIcon className="w-4 h-4 ml-2" />
            {t("labels.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingOfferId(row.id);
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

  const state = OffersTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (offer: OfferRow) => offer.id,
    loading: isLoading,
    filtered: searchQuery !== "",
  });

  return (
    <>
      <Box>
        <OffersTableLayout
          filters={
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={{ md: 10 }}>
                  <TextField
                    size="small"
                    placeholder={t("labels.search")}
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
                  <Can check={[PERMISSIONS.ecommerce.flashDeal.create]}>
                    <Button
                      variant="contained"
                      onClick={() => setEditingOfferId("new")}
                      fullWidth
                    >
                      اضافة عرض
                    </Button>
                  </Can>
                </Grid>
              </Grid>
            </Stack>
          }
          table={
            <OffersTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<OffersTableLayout.Pagination state={state} />}
        />
      </Box>

      <Can check={[PERMISSIONS.ecommerce.flashDeal.update]}>
        <OfferDialog
          open={Boolean(editingOfferId)}
          onClose={() => setEditingOfferId(null)}
          offerId={
            editingOfferId === "new" ? undefined : editingOfferId || undefined
          }
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
            setEditingOfferId(null);
          }}
        />
      </Can>

      <DeleteButton
        message={t("offer.deleteConfirm")}
        onDelete={async () => {
          if (deletingOfferId) {
            await FlashDealsApi.delete(deletingOfferId);
            queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
          }
          setDeleteDialogOpen(false);
          setDeletingOfferId(null);
        }}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        translations={{
          deleteSuccess: t("labels.deleteSuccess"),
          deleteError: t("labels.deleteError"),
          deleteCancelled: t("labels.deleteCancelled"),
        }}
      />
    </>
  );
}

export default OfferView;
