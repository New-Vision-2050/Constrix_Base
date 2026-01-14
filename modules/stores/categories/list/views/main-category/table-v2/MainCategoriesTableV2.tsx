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
import { CategoryRow } from "./types";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";

// Create typed table instance
const CategoriesTable = HeadlessTableLayout<CategoryRow>();

/**
 * Main Categories Table V2 - HeadlessTable Implementation
 * Migrated from old TableBuilder for better performance
 * Features: Search, Pagination, CRUD operations with Two-Hook Pattern
 */
export function MainCategoriesTableV2() {
  const { can } = usePermissions();
  const t = useTranslations("stores.mainCategories");

  // Dialog states
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = CategoriesTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  // ✅ STEP 2: Fetch data using useQuery directly
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "categories",
      params.page,
      params.limit,
      params.sortBy,
      params.sortDirection,
      searchQuery,
    ],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/ecommerce/dashboard/categories?depth=0&page=${params.page}&per_page=${params.limit}&search=${searchQuery || ""}&sort_by=${params.sortBy}&sort_direction=${params.sortDirection}`
      );
      const result = await response.data;
      return result;
    },
  });

  // Extract data from response
  const categories = useMemo<CategoryRow[]>(
    () => data?.payload || [],
    [data]
  );

  const totalPages = useMemo(
    () => data?.pagination?.last_page || 1,
    [data]
  );

  const totalItems = useMemo(
    () => data?.pagination?.result_count || 0,
    [data]
  );

  // Permission checks
  const canEdit = can(PERMISSIONS.ecommerce.category.update);
  const canDelete = can(PERMISSIONS.ecommerce.category.delete);

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await apiClient.delete(`${baseURL}/ecommerce/dashboard/categories/${deleteConfirmId}`);
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
      render: (row: CategoryRow) => (
        <RowActions
          row={row}
          onEdit={setEditingCategoryId}
          onDelete={handleDeleteClick}
          canEdit={canEdit}
          canDelete={canDelete}
          t={t}
        />
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = CategoriesTable.useTableState({
    data: categories,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (category) => category.id,
    loading: isLoading,
    filtered: searchQuery !== "",
  });

  return (
    <>
      <CategoriesTable
        filters={
          <TableFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onReset={handleReset}
            t={t}
            setAddDialogOpen={setAddDialogOpen}
            refetch={refetch}
          />
        }
        table={<CategoriesTable.Table state={state} loadingOptions={{ rows: 5 }} />}
        pagination={<CategoriesTable.Pagination state={state} />}
      />

      {/* Edit Dialog */}
      {editingCategoryId && (
        <AddCategoryDialog
          open={Boolean(editingCategoryId)}
          onClose={() => setEditingCategoryId(null)}
          categoryId={editingCategoryId}
          onSuccess={() => {
            refetch();
            setEditingCategoryId(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={t("table.deleteConfirm")}
      />
    </>
  );
}
