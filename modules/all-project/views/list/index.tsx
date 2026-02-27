"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { LayoutGrid, List, EditIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import DeleteButton from "@/components/shared/delete-button";
import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/all-projects";
import { ProjectRow, getProjectsColumns } from "./columns";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectFormDrawer } from "./components/ProjectFormDrawer";

const ProjectsTableLayout =
  HeadlessTableLayout<ProjectRow>("all-projects-list");

const PROJECTS_QUERY_KEY = "all-projects-list";

export default function AllProjectsList() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProjectTypeId, setFilterProjectTypeId] = useState<string>("");

  const params = ProjectsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const handleEdit = useCallback((projectId: number) => {
    setEditingProjectId(projectId);
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((projectId: number) => {
    setDeletingProjectId(projectId);
    setDeleteDialogOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingProjectId(null);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingProjectId(null);
  }, []);

  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      PROJECTS_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
      filterStatus,
      filterProjectTypeId,
    ],
    queryFn: async () => {
      const response = await AllProjectsApi.list({
        page: params.page,
        per_page: params.limit,
        ...(params.search ? { name: params.search } : {}),
        ...(filterStatus !== "" ? { status: filterStatus } : {}),
        ...(filterProjectTypeId
          ? { project_type_id: filterProjectTypeId }
          : {}),
      });

      const payload = response.data.payload ?? [];
      const pagination = response.data.pagination;
      return {
        data: payload as ProjectRow[],
        totalPages: pagination?.last_page ?? 1,
        totalItems: pagination?.result_count ?? payload.length,
      };
    },
  });

  const data = queryData?.data ?? [];
  const totalPages = queryData?.totalPages ?? 1;
  const totalItems = queryData?.totalItems ?? 0;

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      ...getProjectsColumns(),
      {
        key: "actions",
        name: t("project.tableActions"),
        sortable: false,
        render: (row: ProjectRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="inherit"
                endIcon={<span style={{ fontSize: 9 }}>▼</span>}
                onClick={onClick}
                sx={{ bgcolor: "#3f3f5a", color: "#fff", minWidth: 80 }}
              >
                {t("project.tableActions")}
              </Button>
            )}
          >
            <MenuItem onClick={() => handleEdit(row.id)}>
              <EditIcon className="w-4 h-4 ml-2" />
              {t("labels.edit")}
            </MenuItem>
            <MenuItem onClick={() => handleDelete(row.id)}>
              <Trash2 className="w-4 h-4 ml-2" />
              {t("labels.delete")}
            </MenuItem>
            <MenuItem onClick={() => handleDelete(row.id)}>
              <Trash2 className="w-4 h-4 ml-2" />
              {t("labels.show")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [t, handleEdit, handleDelete],
  );

  // ── Table state ──────────────────────────────────────────────────────────
  const state = ProjectsTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ProjectRow) => String(row.id),
    loading: isLoading,
    searchable: true,
    onExport: async () => {},
  });

  // ── View toggle ──────────────────────────────────────────────────────────
  const viewToggle = (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      <Button
        size="small"
        variant={viewMode === "table" ? "contained" : "outlined"}
        onClick={() => setViewMode("table")}
        sx={{ minWidth: 36, px: 1 }}
      >
        <List size={16} />
      </Button>
      <Button
        size="small"
        variant={viewMode === "cards" ? "contained" : "outlined"}
        onClick={() => setViewMode("cards")}
        sx={{ minWidth: 36, px: 1 }}
      >
        <LayoutGrid size={16} />
      </Button>
    </Box>
  );

  const addButton = (
    <Button variant="contained" color="primary" onClick={handleAddNew}>
      {t("project.addProject")}
    </Button>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          {t("project.filterSearch")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel>{t("project.projectClassification")}</InputLabel>
            <Select
              value={filterProjectTypeId}
              label={t("project.projectClassification")}
              onChange={(e) => setFilterProjectTypeId(e.target.value)}
            >
              <MenuItem value="">{t("project.all")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>{t("project.projectStatus")}</InputLabel>
            <Select
              value={filterStatus}
              label={t("project.projectStatus")}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">{t("project.all")}</MenuItem>
              <MenuItem value="1">{t("project.statusOngoing")}</MenuItem>
              <MenuItem value="0">{t("project.statusInProgress")}</MenuItem>
              <MenuItem value="-1">{t("project.statusStopped")}</MenuItem>
              <MenuItem value="2">{t("project.statusCompleted")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      {viewMode === "table" ? (
        <ProjectsTableLayout
          filters={
            <ProjectsTableLayout.TopActions
              state={state}
              customActions={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {viewToggle}
                  {addButton}
                </Box>
              }
            />
          }
          table={
            <ProjectsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 5 }}
            />
          }
          pagination={<ProjectsTableLayout.Pagination state={state} />}
        />
      ) : (
        /* ── Cards view ─────────────────────────────────────────────────── */
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            {viewToggle}
            {addButton}
          </Box>

          {isLoading ? (
            <LinearProgress />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 2,
              }}
            >
              {data.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => handleEdit(project.id)}
                  onDelete={() => handleDelete(project.id)}
                  t={t}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      <ProjectFormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        editingProjectId={editingProjectId}
        queryKey={PROJECTS_QUERY_KEY}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────────────────── */}
      <DeleteButton
        message={t("project.deleteConfirm")}
        onDelete={async () => {
          if (!deletingProjectId) return;
          await AllProjectsApi.delete(deletingProjectId);
          queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
          setDeleteDialogOpen(false);
          setDeletingProjectId(null);
        }}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        translations={{
          deleteSuccess: t("labels.deleteSuccess"),
          deleteError: t("labels.deleteError"),
          deleteCancelled: t("labels.deleteCancelled"),
        }}
      />
    </Box>
  );
}
