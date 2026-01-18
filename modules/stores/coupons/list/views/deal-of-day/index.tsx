"use client";

import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Box, Stack, Grid, TextField, Button, MenuItem } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { DealOfDayDialog } from "@/modules/stores/components/dialogs/add-coupons";
import HeadlessTableLayout from "@/components/headless/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/shared/delete-button";
import CustomMenu from "@/components/headless/custom-menu";
import { EditIcon, Trash2 } from "lucide-react";
import { DealOfDayRow, getDealOfDayColumns } from "./columns";
import { DealDaysApi } from "@/services/api/ecommerce/deal-days";

const DEAL_OF_DAY_QUERY_KEY = "deal-of-day-list";

const DealOfDayTableLayout = HeadlessTableLayout<DealOfDayRow>();

function DealOfDayView() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const params = DealOfDayTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryData, isLoading } = useQuery({
    queryKey: [DEAL_OF_DAY_QUERY_KEY, params.page, params.limit, searchQuery],
    queryFn: async () => {
      const response = await DealDaysApi.list({
        search: searchQuery,
        page: params.page,
        per_page: params.limit,
      });

      const deals = (response.data.payload as DealOfDayRow[]) || [];
      const pagination = response.data.pagination;

      return {
        data: deals,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? deals.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  const columns = [
    ...getDealOfDayColumns(t),
    {
      key: "actions",
      name: t("labels.actions"),
      sortable: false,
      render: (row: DealOfDayRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("labels.actions")}</Button>
          )}
        >
          <MenuItem onClick={() => setEditingDealId(row.id)}>
            <EditIcon className="w-4 h-4 ml-2" />
            {t("labels.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingDealId(row.id);
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

  const state = DealOfDayTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (deal: DealOfDayRow) => deal.id,
    loading: isLoading,
    filtered: searchQuery !== "",
  });

  return (
    <>
      <Box>
        <DealOfDayTableLayout
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
                  <Can check={[PERMISSIONS.ecommerce.dealDay.create]}>
                    <Button
                      variant="contained"
                      onClick={() => setEditingDealId("new")}
                      fullWidth
                    >
                      اضافة صفقة اليوم
                    </Button>
                  </Can>
                </Grid>
              </Grid>
            </Stack>
          }
          table={
            <DealOfDayTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<DealOfDayTableLayout.Pagination state={state} />}
        />
      </Box>

      <Can check={[PERMISSIONS.ecommerce.dealDay.update]}>
        <DealOfDayDialog
          open={Boolean(editingDealId)}
          onClose={() => setEditingDealId(null)}
          dealId={
            editingDealId === "new" ? undefined : editingDealId || undefined
          }
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [DEAL_OF_DAY_QUERY_KEY],
            });
            setEditingDealId(null);
          }}
        />
      </Can>

      <DeleteButton
        message={t("dealOfDay.deleteConfirm")}
        onDelete={async () => {
          if (deletingDealId) {
            await DealDaysApi.delete(deletingDealId);
            queryClient.invalidateQueries({
              queryKey: [DEAL_OF_DAY_QUERY_KEY],
            });
          }
          setDeleteDialogOpen(false);
          setDeletingDealId(null);
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

export default DealOfDayView;
