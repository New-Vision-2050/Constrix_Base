"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
} from "@mui/material";
import { EditIcon, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectManagementsApi } from "@/services/api/projects/project-managements";
import {
  projectManagementsQueryKey,
  useProjectManagements,
} from "@/modules/projects/project/query/useProjectManagements";
import type { ManagementRow } from "./types";
import AddManagementDialog from "./AddManagementDialog";

const ManagementsTableLayout = HeadlessTableLayout<ManagementRow>(
  "managements",
);

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 16).replace("T", " ");
}

export default function ManagementsTab() {
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const t = useTranslations("project.managementsTab");
  const tTable = useTranslations("project.managementsTab.table");
  const tCommon = useTranslations("common");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [managementToEdit, setManagementToEdit] =
    useState<ManagementRow | null>(null);
  const [managementToDelete, setManagementToDelete] =
    useState<ManagementRow | null>(null);

  const params = ManagementsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });
  const emptyDash = t("emptyDash");

  const managementsQuery = useProjectManagements(projectId);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return ProjectManagementsApi.delete(id);
    },
    onSuccess: (res) => {
      setManagementToDelete(null);
      toast.success(res.data?.message ?? t("deleteSuccess"));
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectManagementsQueryKey(projectId),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? t("deleteError"));
    },
  });

  const allRows = useMemo<ManagementRow[]>(() => {
    const data = managementsQuery.data ?? [];
    return data.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      createdAt: item.created_at ?? "",
      updatedAt: item.updated_at ?? "",
    }));
  }, [managementsQuery.data]);

  const totalItems = allRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return allRows.slice(start, start + params.limit);
  }, [allRows, params.page, params.limit]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: tTable("name"),
        sortable: false,
        render: (row: ManagementRow) => (
          <span>{row.name.trim() ? row.name : emptyDash}</span>
        ),
      },
      {
        key: "createdAt",
        name: tTable("createdAt"),
        sortable: false,
        render: (row: ManagementRow) => (
          <span>
            {row.createdAt.trim() ? formatDateTime(row.createdAt) : emptyDash}
          </span>
        ),
      },
      {
        key: "updatedAt",
        name: tTable("updatedAt"),
        sortable: false,
        render: (row: ManagementRow) => (
          <span>
            {row.updatedAt.trim() ? formatDateTime(row.updatedAt) : emptyDash}
          </span>
        ),
      },
      {
        key: "actions",
        name: tTable("actions"),
        sortable: false,
        render: (row: ManagementRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {tTable("action")}
              </Button>
            )}
          >
            <MenuItem
              onClick={() => {
                setManagementToEdit(row);
              }}
            >
              <EditIcon className="w-4 h-4 me-2" />
              {tTable("edit")}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setManagementToDelete(row);
              }}
              disabled={deleteMutation.isPending}
              sx={{ color: "error.main" }}
            >
              <Trash2 className="w-4 h-4 me-2" />
              {tTable("delete")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [tTable, emptyDash, deleteMutation.isPending],
  );

  const state = ManagementsTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ManagementRow) => String(row.id),
    loading: managementsQuery.isLoading,
    searchable: true,
    onExport: async () => {},
  });

  const handleSaved = () => {
    if (projectId) {
      queryClient.invalidateQueries({
        queryKey: projectManagementsQueryKey(projectId),
      });
    }
  };

  if (!projectId) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {managementsQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
        </Alert>
      ) : null}

      <ManagementsTableLayout
        filters={
          <ManagementsTableLayout.TopActions
            state={state}
            searchComponent={
              state.table.searchable ? (
                <ManagementsTableLayout.Search
                  search={state.search}
                  placeholder={t("searchPlaceholder")}
                />
              ) : undefined
            }
            customActions={
              <Button
                variant="contained"
                onClick={() => setAddDialogOpen(true)}
              >
                {t("addManagement")}
              </Button>
            }
          />
        }
        table={
          <ManagementsTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<ManagementsTableLayout.Pagination state={state} />}
      />

      <AddManagementDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        projectId={projectId}
        onSaved={handleSaved}
      />

      <AddManagementDialog
        open={managementToEdit != null}
        projectId={projectId}
        managementId={managementToEdit?.id ?? null}
        initialName={managementToEdit?.name ?? ""}
        onClose={() => setManagementToEdit(null)}
        onSaved={handleSaved}
      />

      <Dialog
        open={managementToDelete != null}
        onClose={() => {
          if (!deleteMutation.isPending) setManagementToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t("deleteConfirmMessage")}
          </Typography>
          {managementToDelete?.name ? (
            <Typography variant="subtitle2" fontWeight={700}>
              {managementToDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setManagementToDelete(null)}
            disabled={deleteMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending || !managementToDelete}
            onClick={() => {
              if (managementToDelete) {
                deleteMutation.mutate(managementToDelete.id);
              }
            }}
          >
            {tTable("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
