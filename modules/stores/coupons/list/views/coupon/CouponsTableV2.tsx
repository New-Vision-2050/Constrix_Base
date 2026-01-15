"use client";

/**
 * Coupons Table V2 - HeadlessTable Implementation
 * Migrated from old TableBuilder for better performance
 * Features: Search, Pagination, CRUD operations
 */

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { toast } from "sonner";
import Can from "@/lib/permissions/client/Can";
import { createColumns } from "./table-v2/columns";
import { TableFilters } from "./table-v2/filters";
import { RowActions } from "./table-v2/actions";
import { useTableData } from "./table-v2/use-table-data";
import { CouponsApi } from "./table-v2/api";
import { Coupon } from "./table-v2/types";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { CouponDialog } from "@/modules/stores/components/dialogs/add-coupons";

// Create typed table instance
const CouponTable = HeadlessTableLayout<Coupon>();

export default function CouponsTableV2() {
  const { can } = usePermissions();
  const t = useTranslations();

  // Edit dialog states
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  // Dialog states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = CouponTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ✅ STEP 2: Fetch data using custom hook
  const { coupons, isLoading, totalPages, totalItems, refetch } = useTableData(
    params.page,
    params.limit,
    searchQuery
  );

  // Permission checks
  const canView = can(PERMISSIONS.ecommerce.coupon.list);
  const canEdit = can(PERMISSIONS.ecommerce.coupon.update);
  const canDelete = can(PERMISSIONS.ecommerce.coupon.delete);

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await CouponsApi.delete(deleteConfirmId);
      toast.success(t("coupon.deleteSuccess"));
      setDeleteConfirmId(null);
      refetch();
    } catch {
      toast.error(t("coupon.deleteError"));
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    params.setPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    params.reset();
  };

  // Edit handler (placeholder - implement based on your routing)
  const handleEdit = (id: string) => {
    console.log("Edit coupon:", id);
    setEditingCouponId(id);
    // TODO: Navigate to edit page or open edit dialog
  };

  // Table columns with actions
  const columns = [
    ...createColumns(t),
    {
      key: "actions",
      name: t("labels.actions"),
      sortable: false,
      render: (row: Coupon) => (
        <RowActions
          row={row}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canView={canView}
          canEdit={canEdit}
          canDelete={canDelete}
          t={t}
        />
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = CouponTable.useTableState({
    data: coupons,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (coupon) => coupon.id,
    loading: isLoading,
    filtered: searchQuery !== "",
  });

  return (
    <Can check={[PERMISSIONS.ecommerce.coupon.list]}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("coupon.title")}</h1>

        <CouponTable
          filters={
            <TableFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onReset={handleReset}
              onRefetch={refetch}
              t={t}
            />
          }
          table={
            <CouponTable.Table state={state} loadingOptions={{ rows: 5 }} />
          }
          pagination={<CouponTable.Pagination state={state} />}
        />
      </div>
      {/* Edit Dialog */}
      <Can check={[PERMISSIONS.ecommerce.coupon.update]}>
        <CouponDialog
          open={Boolean(editingCouponId)}
          onClose={() => setEditingCouponId(null)}
          couponId={editingCouponId || undefined}
          onSuccess={() => refetch()}
        />
      </Can>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={t("coupon.deleteConfirmMessage")}
      />
    </Can>
  );
}
