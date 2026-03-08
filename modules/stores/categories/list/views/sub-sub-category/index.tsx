"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import DialogTrigger from "@/components/headless/dialog-trigger";
import CustomMenu from "@/components/headless/custom-menu";
import { apiClient, baseURL } from "@/config/axios-config";
import AddSubSubCategoryDialog from "@/modules/stores/components/dialogs/add-category/addSubSubCategory";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { EditIcon, Trash2 } from "lucide-react";
import { getSubSubCategoryColumns, CategoryRow } from "./columns";

const SUB_SUB_CATEGORIES_QUERY_KEY = "sub-sub-categories-list";
const SubSubCategoriesTableLayout = HeadlessTableLayout<CategoryRow>("sssc");

function SubSubCategoriesView() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<
    string | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<
    string | undefined
  >();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [SUB_SUB_CATEGORIES_QUERY_KEY] });
  };

  const params = SubSubCategoriesTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "name",
    initialSortDirection: "asc",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      SUB_SUB_CATEGORIES_QUERY_KEY,
      params.page,
      params.limit,
      params.sortBy,
      params.sortDirection,
      params.search,
    ],
    queryFn: async () => {
      const response = await apiClient.get(
        `${baseURL}/ecommerce/dashboard/categories?depth=2&page=${params.page}&per_page=${params.limit}&search=${params.search || ""}&sort_by=${params.sortBy || ""}&sort_direction=${params.sortDirection}`,
      );
      return response.data;
    },
  });

  const rows = useMemo<CategoryRow[]>(() => data?.payload || [], [data]);
  const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);
  const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

  const columns = [
    ...getSubSubCategoryColumns(t),
    {
      key: "actions",
      name: t("labels.actions"),
      sortable: false,
      render: (row: CategoryRow) => (
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Button onClick={onClick}>{t("labels.actions")}</Button>
          )}
        >
          <MenuItem
            onClick={() => {
              setEditingCategoryId(row.id);
              setEditDialogOpen(true);
            }}
          >
            <EditIcon className="w-4 h-4 ml-2" />
            {t("labels.edit")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeletingCategoryId(row.id);
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

  const state = SubSubCategoriesTableLayout.useTableState({
    data: rows,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: CategoryRow) => row.id,
    loading: isLoading,
    searchable: true,
  });

  return (
    <Box py={2}>
      <Typography variant="h6" sx={{ my: 4 }}>
        اﻷقسام الفرعية الفرعية
      </Typography>
      <SubSubCategoriesTableLayout
        filters={
          <SubSubCategoriesTableLayout.TopActions
            state={state}
            customActions={
              <Can check={[PERMISSIONS.ecommerce.category.create]}>
                <DialogTrigger
                  component={AddSubSubCategoryDialog}
                  dialogProps={{
                    onSuccess: () => {
                      refetch();
                    },
                  }}
                  render={({ onOpen }) => (
                    <Button variant="contained" onClick={onOpen}>
                      اضافة قسم فرعي فرعي
                    </Button>
                  )}
                />
              </Can>
            }
          >
            {/* Add category button */}
          </SubSubCategoriesTableLayout.TopActions>
        }
        table={
          <SubSubCategoriesTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<SubSubCategoriesTableLayout.Pagination state={state} />}
      />

      {/* Edit Dialog */}
      <AddSubSubCategoryDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingCategoryId(undefined);
        }}
        onSuccess={() => {
          invalidate();
          setEditDialogOpen(false);
          setEditingCategoryId(undefined);
        }}
        categoryId={editingCategoryId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        deleteUrl={`${baseURL}/ecommerce/dashboard/categories/${deletingCategoryId}`}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingCategoryId(undefined);
        }}
        open={deleteDialogOpen}
        onSuccess={() => {
          invalidate();
          setDeleteDialogOpen(false);
          setDeletingCategoryId(undefined);
        }}
      />
    </Box>
  );
}

export default SubSubCategoriesView;
