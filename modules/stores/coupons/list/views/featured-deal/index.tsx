"use client";

import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Box, Button, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import { FeaturedDealDialog } from "@/modules/stores/components/dialogs/add-coupons";
import HeadlessTableLayout from "@/components/headless/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/shared/delete-button";
import CustomMenu from "@/components/headless/custom-menu";
import { EditIcon, Trash2 } from "lucide-react";
import { FeaturedDealRow, getFeaturedDealColumns } from "./columns";
import { FeatureDealsApi } from "@/services/api/ecommerce/feature-deals";

const FEATURED_DEAL_QUERY_KEY = "featured-deal-list";

const FeaturedDealTableLayout = HeadlessTableLayout<FeaturedDealRow>("sfd");

function FeaturedDealView() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const params = FeaturedDealTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      FEATURED_DEAL_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
    ],
    queryFn: async () => {
      const response = await FeatureDealsApi.list({
        search: params.search,
        page: params.page,
        per_page: params.limit,
      });

      const deals = (response.data.payload as FeaturedDealRow[]) || [];
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
    ...getFeaturedDealColumns(t),
    {
      key: "actions",
      name: t("labels.actions"),
      sortable: false,
      render: (row: FeaturedDealRow) => (
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

  const state = FeaturedDealTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (deal: FeaturedDealRow) => deal.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <>
      <Box>
        <FeaturedDealTableLayout
          filters={
            <FeaturedDealTableLayout.TopActions
              state={state}
              customActions={
                <Can check={[PERMISSIONS.ecommerce.featureDeal.create]}>
                  <Button
                    variant="contained"
                    onClick={() => setEditingDealId("new")}
                  >
                    اضافة صفقة مميزة
                  </Button>
                </Can>
              }
            />
          }
          table={
            <FeaturedDealTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<FeaturedDealTableLayout.Pagination state={state} />}
        />
      </Box>

      <Can check={[PERMISSIONS.ecommerce.featureDeal.update]}>
        <FeaturedDealDialog
          open={Boolean(editingDealId)}
          onClose={() => setEditingDealId(null)}
          dealId={
            editingDealId === "new" ? undefined : editingDealId || undefined
          }
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [FEATURED_DEAL_QUERY_KEY],
            });
            setEditingDealId(null);
          }}
        />
      </Can>

      <DeleteButton
        message={t("featuredDeal.deleteConfirm")}
        onDelete={async () => {
          if (deletingDealId) {
            await FeatureDealsApi.delete(deletingDealId);
            queryClient.invalidateQueries({
              queryKey: [FEATURED_DEAL_QUERY_KEY],
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

export default FeaturedDealView;
