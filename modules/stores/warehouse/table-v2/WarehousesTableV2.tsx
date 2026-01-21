"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { apiClient, baseURL } from "@/config/axios-config";
import { createColumns } from "./columns";
import { TableFilters } from "./filters";
import { RowActions } from "./actions";
import { WarehouseRow } from "./types";
import AddWarehouse2Dialog from "@/modules/stores/components/dialogs/add-warehouse-2";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { WarehousesApi } from "@/services/api/ecommerce/warehouses";
import { downloadFromResponse } from "@/utils/downloadFromResponse";

// Create typed table instance
const WarehousesTable = HeadlessTableLayout<WarehouseRow>();

/**
 * Warehouses Table V2 - HeadlessTable Implementation
 * Migrated from old TableBuilder for better performance
 * Features: Search, Pagination, CRUD operations with Two-Hook Pattern
 */
export function WarehousesTableV2() {
  const { can } = usePermissions();
  const t = useTranslations("stores.warehouse");

  // Dialog states
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = WarehousesTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  // ✅ STEP 2: Fetch data using useQuery directly
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "warehouses",
      params.page,
      params.limit,
      params.sortBy,
      params.sortDirection,
      searchQuery,
    ],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/ecommerce/warehouses?page=${params.page}&per_page=${params.limit}&search=${searchQuery || ""}&sort_by=${params.sortBy}&sort_direction=${params.sortDirection}`,
      );
      return response.data;
    },
  });

  // Extract data from response
  const warehouses = useMemo<WarehouseRow[]>(() => data?.payload || [], [data]);

  const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);

  const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

  // Permission checks
  const canEdit = can(PERMISSIONS.ecommerce.warehouse.update);
  const canDelete = can(PERMISSIONS.ecommerce.warehouse.delete);

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await apiClient.delete(
        `${baseURL}/ecommerce/warehouses/${deleteConfirmId}`,
      );
      refetch();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Delete failed:", error);
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

  // Table columns with actions
  const columns = [
    ...createColumns(t),
    {
      key: "actions",
      name: t("table.actions"),
      sortable: false,
      render: (row: WarehouseRow) => (
        <RowActions
          row={row}
          onEdit={setEditingWarehouseId}
          onDelete={handleDeleteClick}
          canEdit={canEdit}
          canDelete={canDelete}
          t={t}
        />
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = WarehousesTable.useTableState({
    data: warehouses,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (warehouse) => warehouse.id,
    loading: isLoading,
    filtered: searchQuery !== "",
    selectable: true,
    onExport: async () => {
      downloadFromResponse(await WarehousesApi.export());
    },
  });

  return (
    <>
      <WarehousesTable
        filters={
          <WarehousesTable.TopActions state={state}>
            <TableFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onReset={handleReset}
              t={t}
              refetch={refetch}
            />
          </WarehousesTable.TopActions>
        }
        table={
          <WarehousesTable.Table state={state} loadingOptions={{ rows: 5 }} />
        }
        pagination={<WarehousesTable.Pagination state={state} />}
      />

      {/* Edit Dialog */}
      {editingWarehouseId && (
        <AddWarehouse2Dialog
          warehouseId={editingWarehouseId}
          open={Boolean(editingWarehouseId)}
          onClose={() => setEditingWarehouseId(null)}
          onSuccess={() => {
            refetch();
            setEditingWarehouseId(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={t("deleteConfirmMessage")}
      />
    </>
  );
}
