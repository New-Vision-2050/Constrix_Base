"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { apiClient, baseURL } from "@/config/axios-config";
import { createColumns } from "./columns";
import { CategoryRow } from "./types";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import Can from "@/lib/permissions/client/Can";
import DialogTrigger from "@/components/headless/dialog-trigger";
import CustomMenu from "@/components/headless/custom-menu";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { EditIcon, Trash2 } from "lucide-react";

// Create typed table instance
const CategoriesTable = HeadlessTableLayout<CategoryRow>("smct");

/**
 * Main Categories Table V2 - HeadlessTable Implementation
 * Migrated from old TableBuilder for better performance
 * Features: Search, Pagination, CRUD operations with Two-Hook Pattern
 */
export function MainCategoriesTableV2() {
  const { can } = usePermissions();
  const t = useTranslations("stores.mainCategories");

  // Dialog states
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
      params.search,
    ],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/ecommerce/dashboard/categories?depth=0&page=${params.page}&per_page=${params.limit}&search=${params.search || ""}&sort_by=${params.sortBy}&sort_direction=${params.sortDirection}`,
      );
      const result = await response.data;
      return result;
    },
  });

  // Extract data from response
  const categories = useMemo<CategoryRow[]>(() => data?.payload || [], [data]);

  const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);

  const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

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
      await apiClient.delete(
        `${baseURL}/ecommerce/dashboard/categories/${deleteConfirmId}`,
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

  // Table columns with actions
  const columns = [
    ...createColumns(t),
    {
      key: "actions",
      name: t("table.actions"),
      sortable: false,
      render: (row: CategoryRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("table.actions")}</Button>
          )}
        >
          <MenuItem
            disabled={!canEdit}
            onClick={() => {
              setEditingCategoryId(row.id);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {t("table.edit")}
          </MenuItem>
          <MenuItem
            disabled={!canDelete}
            onClick={() => {
              handleDeleteClick(row.id);
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
  const state = CategoriesTable.useTableState({
    data: categories,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (category) => category.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <>
      <CategoriesTable
        filters={
          <CategoriesTable.TopActions
            state={state}
            customActions={
              <Can check={[PERMISSIONS.ecommerce.category.create]}>
                <DialogTrigger
                  component={AddCategoryDialog}
                  dialogProps={{
                    onSuccess: () => {
                      refetch();
                    },
                  }}
                  render={({ onOpen }) => (
                    <Button variant="contained" onClick={onOpen}>
                      {t("table.add")}
                    </Button>
                  )}
                />
              </Can>
            }
          >
            <Box>
              <Typography variant="h6" sx={{ my: 4 }}>
                {t("title")}
              </Typography>
            </Box>
          </CategoriesTable.TopActions>
        }
        table={
          <CategoriesTable.Table state={state} loadingOptions={{ rows: 5 }} />
        }
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
