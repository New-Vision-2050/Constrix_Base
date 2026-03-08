"use client";

import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Box, Button, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import { CouponDialog } from "@/modules/stores/components/dialogs/add-coupons";
import HeadlessTableLayout from "@/components/headless/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/shared/delete-button";
import CustomMenu from "@/components/headless/custom-menu";
import { EditIcon, Trash2 } from "lucide-react";
import { CouponRow, getCouponColumns } from "./columns";
import { CouponsApi } from "@/services/api/ecommerce/coupons";

const COUPONS_QUERY_KEY = "coupons-list";

const CouponsTableLayout = HeadlessTableLayout<CouponRow>("scpn");

function CouponView() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const params = CouponsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryData, isLoading } = useQuery({
    queryKey: [COUPONS_QUERY_KEY, params.page, params.limit, params.search],
    queryFn: async () => {
      const response = await CouponsApi.list({
        search: params.search,
        page: params.page,
        per_page: params.limit,
      });

      const coupons = (response.data.payload as CouponRow[]) || [];
      const pagination = response.data.pagination;

      return {
        data: coupons,
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? coupons.length,
      };
    },
  });

  const data = queryData?.data || [];
  const totalPages = queryData?.totalPages || 0;
  const totalItems = queryData?.totalItems || 0;

  const columns = [
    ...getCouponColumns(t),
    {
      key: "actions",
      name: t("labels.actions"),
      sortable: false,
      render: (row: CouponRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("labels.actions")}</Button>
          )}
        >
          <MenuItem onClick={() => setEditingCouponId(row.id)}>
            <EditIcon className="w-4 h-4 ml-2" />
            {t("labels.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingCouponId(row.id);
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

  const state = CouponsTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (coupon: CouponRow) => coupon.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <>
      <Box>
        <CouponsTableLayout
          filters={
            <CouponsTableLayout.TopActions
              state={state}
              customActions={
                <Can check={[PERMISSIONS.ecommerce.coupon.create]}>
                  <Button
                    variant="contained"
                    onClick={() => setEditingCouponId("new")}
                  >
                    اضافة قسيمة
                  </Button>
                </Can>
              }
            />
          }
          table={
            <CouponsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<CouponsTableLayout.Pagination state={state} />}
        />
      </Box>

      <Can check={[PERMISSIONS.ecommerce.coupon.update]}>
        <CouponDialog
          open={Boolean(editingCouponId)}
          onClose={() => setEditingCouponId(null)}
          couponId={
            editingCouponId === "new" ? undefined : editingCouponId || undefined
          }
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
            setEditingCouponId(null);
          }}
        />
      </Can>

      <DeleteButton
        message={t("coupon.deleteConfirm")}
        onDelete={async () => {
          if (deletingCouponId) {
            await CouponsApi.delete(deletingCouponId);
            queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
          }
          setDeleteDialogOpen(false);
          setDeletingCouponId(null);
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

export default CouponView;
