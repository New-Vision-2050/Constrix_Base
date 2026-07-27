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
import { ProjectDistrictsApi } from "@/services/api/projects/project-districts";
import {
  projectDistrictsQueryKey,
  useProjectDistricts,
} from "@/modules/projects/project/query/useProjectDistricts";
import type { DistrictRow } from "./types";
import AddDistrictDialog from "./AddDistrictDialog";

const DistrictsTableLayout = HeadlessTableLayout<DistrictRow>(
  "districts",
);

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 16).replace("T", " ");
}

export default function DistrictsTab() {
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const t = useTranslations("project.districtsTab");
  const tTable = useTranslations("project.districtsTab.table");
  const tCommon = useTranslations("common");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [districtToEdit, setDistrictToEdit] = useState<DistrictRow | null>(
    null,
  );
  const [districtToDelete, setDistrictToDelete] =
    useState<DistrictRow | null>(null);

  const params = DistrictsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });
  const emptyDash = t("emptyDash");

  const districtsQuery = useProjectDistricts(projectId);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return ProjectDistrictsApi.delete(id);
    },
    onSuccess: (res) => {
      setDistrictToDelete(null);
      toast.success(res.data?.message ?? t("deleteSuccess"));
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectDistrictsQueryKey(projectId),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? t("deleteError"));
    },
  });

  const allRows = useMemo<DistrictRow[]>(() => {
    const data = districtsQuery.data ?? [];
    return data.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      createdAt: item.created_at ?? "",
      updatedAt: item.updated_at ?? "",
    }));
  }, [districtsQuery.data]);

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
        render: (row: DistrictRow) => (
          <span>{row.name.trim() ? row.name : emptyDash}</span>
        ),
      },
      {
        key: "createdAt",
        name: tTable("createdAt"),
        sortable: false,
        render: (row: DistrictRow) => (
          <span>
            {row.createdAt.trim() ? formatDateTime(row.createdAt) : emptyDash}
          </span>
        ),
      },
      {
        key: "updatedAt",
        name: tTable("updatedAt"),
        sortable: false,
        render: (row: DistrictRow) => (
          <span>
            {row.updatedAt.trim() ? formatDateTime(row.updatedAt) : emptyDash}
          </span>
        ),
      },
      {
        key: "actions",
        name: tTable("actions"),
        sortable: false,
        render: (row: DistrictRow) => (
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
                setDistrictToEdit(row);
              }}
            >
              <EditIcon className="w-4 h-4 me-2" />
              {tTable("edit")}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setDistrictToDelete(row);
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

  const state = DistrictsTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: DistrictRow) => String(row.id),
    loading: districtsQuery.isLoading,
    searchable: true,
    onExport: async () => {},
  });

  const handleSaved = () => {
    if (projectId) {
      queryClient.invalidateQueries({
        queryKey: projectDistrictsQueryKey(projectId),
      });
    }
  };

  if (!projectId) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {districtsQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
        </Alert>
      ) : null}

      <DistrictsTableLayout
        filters={
          <DistrictsTableLayout.TopActions
            state={state}
            searchComponent={
              state.table.searchable ? (
                <DistrictsTableLayout.Search
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
                {t("addDistrict")}
              </Button>
            }
          />
        }
        table={
          <DistrictsTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<DistrictsTableLayout.Pagination state={state} />}
      />

      <AddDistrictDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        projectId={projectId}
        onSaved={handleSaved}
      />

      <AddDistrictDialog
        open={districtToEdit != null}
        projectId={projectId}
        districtId={districtToEdit?.id ?? null}
        initialName={districtToEdit?.name ?? ""}
        onClose={() => setDistrictToEdit(null)}
        onSaved={handleSaved}
      />

      <Dialog
        open={districtToDelete != null}
        onClose={() => {
          if (!deleteMutation.isPending) setDistrictToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t("deleteConfirmMessage")}
          </Typography>
          {districtToDelete?.name ? (
            <Typography variant="subtitle2" fontWeight={700}>
              {districtToDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDistrictToDelete(null)}
            disabled={deleteMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending || !districtToDelete}
            onClick={() => {
              if (districtToDelete) {
                deleteMutation.mutate(districtToDelete.id);
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
