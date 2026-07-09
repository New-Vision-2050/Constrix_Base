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
  Chip,
  Alert,
} from "@mui/material";
import { LayoutGrid, List, EditIcon, Trash2, Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@/i18n/navigation";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import DeleteButton from "@/components/shared/delete-button";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useQuery } from "@tanstack/react-query";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { ProjectRow, getProjectsColumns } from "./columns";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectFormDrawer } from "./components/ProjectFormDrawer";
import { ROUTER } from "@/router";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import { statisticsConfig } from "./components/statistics-config";

const ProjectsTableLayout =
  HeadlessTableLayout<ProjectRow>("all-projects-list");

const PROJECTS_QUERY_KEY = "all-projects-list";

function ProjectsList() {
  const t = useTranslations();
  const tProject = useTranslations("project");
  const locale = useLocale();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProjectTypeId, setFilterProjectTypeId] = useState<string>("");
  const [statisticsRefreshKey, setStatisticsRefreshKey] = useState(0);

  const { data: projectTypesData } = useQuery({
    queryKey: ["all-projects-types-filter"],
    queryFn: () => AllProjectsApi.getProjectTypes(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const params = ProjectsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const handleEdit = useCallback((projectId: string | number) => {
    setEditingProjectId(String(projectId));
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((projectId: string | number) => {
    setDeletingProjectId(String(projectId));
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

  const handleProjectSaved = useCallback(() => {
    setStatisticsRefreshKey((prev) => prev + 1);
  }, []);

  const { data: queryData, isLoading } = useQuery({
    queryKey: [
      PROJECTS_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
      params.sortBy,
      params.sortOrder,
      filterStatus,
      filterProjectTypeId,
    ],
    queryFn: async () => {
      const response = await AllProjectsApi.list({
        page: params.page,
        per_page: params.limit,
        ...(params.search ? { name: params.search } : {}),
        ...(params.sortBy ? { sort_by: params.sortBy } : {}),
        ...(params.sortOrder ? { sort_order: params.sortOrder } : {}),
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
      ...getProjectsColumns(tProject),
      {
        key: "actions",
        name: tProject("tableActions"),
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
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  minWidth: 80,
                }}
              >
                {tProject("tableActions")}
              </Button>
            )}
          >
            <Can check={[PERMISSIONS.projectManagement.update]}>
              <MenuItem onClick={() => handleEdit(row.id)}>
                <EditIcon className="w-4 h-4 ml-2" />
                {t("labels.edit")}
              </MenuItem>
            </Can>
            <Can check={[PERMISSIONS.projectManagement.delete]}>
              <MenuItem onClick={() => handleDelete(row.id)}>
                <Trash2 className="w-4 h-4 ml-2" />
                {t("labels.delete")}
              </MenuItem>
            </Can>
            <Can check={[PERMISSIONS.projectManagement.view]}>
              <MenuItem
                component={Link}
                href={ROUTER.PROJECT_DETAILS(String(row.id))}
                locale={locale}
              >
                <Eye className="w-4 h-4 ml-2" />
                {t("labels.show")}
              </MenuItem>
            </Can>
          </CustomMenu>
        ),
      },
    ],
    [t, tProject, handleEdit, handleDelete, locale],
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
    <Can check={[PERMISSIONS.projectManagement.create]}>
      <Button variant="contained" color="primary" onClick={handleAddNew}>
        {t("project.addProject")}
      </Button>
    </Can>
  );

  return (
    <Box sx={{ p: 3 }}>
      <StatisticsStoreRow
        config={statisticsConfig}
        refreshKey={statisticsRefreshKey}
      />

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
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
              {(projectTypesData?.data?.payload ?? []).map(
                (type: { id: number; name: string }) => (
                  <MenuItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </MenuItem>
                ),
              )}
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

      {/* ── Selected Rows Count Alert ─────────────────────────────────── */}
      {state.selection.selectedCount > 0 && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={`${state.selection.selectedCount} ${state.selection.selectedCount === 1 ? tProject("selected") : tProject("selectedRows")}`}
              color="primary"
              variant="filled"
              sx={{ fontWeight: "600" }}
            />
            <Typography variant="body2" color="textSecondary">
              {tProject("selectedRowsMessage")}
            </Typography>
          </Box>
        </Alert>
      )}

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
                  tProject={tProject}
                  locale={locale}
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
        onSaved={handleProjectSaved}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────────────────── */}
      <Can check={[PERMISSIONS.projectManagement.delete]}>
        <DeleteButton
          message={t("project.deleteConfirm")}
          onDelete={async () => {
            if (!deletingProjectId) return;
            await AllProjectsApi.delete(deletingProjectId);
            queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
            setStatisticsRefreshKey((prev) => prev + 1);
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
      </Can>
    </Box>
  );
}

export default ProjectsList;
