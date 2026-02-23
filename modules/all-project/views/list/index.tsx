"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { LayoutGrid, List, EditIcon, Trash2, MoreVertical } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { SheetFormBuilder } from "@/modules/form-builder";
import { useQuery } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/config/axios-config";
import { getAddProjectFormConfig } from "./form-config";
import { ProjectRow, getProjectsColumns, STATUS_MAP } from "./columns";

// ============================================================================
// Table instance
// ============================================================================

const ProjectsTableLayout = HeadlessTableLayout<ProjectRow>("all-projects-list");

// ============================================================================
// Cards view
// ============================================================================

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: ProjectRow;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusCfg =
    project.status !== undefined ? STATUS_MAP[project.status] : undefined;

  const fields = [
    { label: "الرقم المرجعي", value: project.ref_number ?? project.id },
    { label: "اسم العميل", value: project.client?.name ?? "—" },
    { label: "المهندس المسؤول", value: project.responsible_employee?.name ?? "—" },
    { label: "الادارة", value: project.management?.name ?? "—" },
    { label: "بداية المشروع", value: project.start_date ?? "—" },
    { label: "نهاية المشروع", value: project.end_date ?? "—" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {project.name}
        </Typography>
        <CustomMenu
          renderAnchor={({ onClick }) => (
            <Box
              component="button"
              onClick={onClick}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "text.secondary",
                p: 0.5,
                borderRadius: 1,
                display: "flex",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <MoreVertical size={18} />
            </Box>
          )}
        >
          <MenuItem onClick={onEdit}>
            <EditIcon className="w-4 h-4 ml-2" />
            تعديل
          </MenuItem>
          <MenuItem onClick={onDelete}>
            <Trash2 className="w-4 h-4 ml-2" />
            حذف
          </MenuItem>
        </CustomMenu>
      </Box>

      {/* Fields grid */}
      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
      >
        {fields.map(({ label, value }) => (
          <Box key={label}>
            <Typography variant="caption" color="text.secondary" display="block">
              {label}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {String(value)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Status + progress */}
      {statusCfg && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={statusCfg.label}
            size="small"
            sx={{
              backgroundColor: statusCfg.bg,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.7rem",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(project.completion_percentage ?? 0, 100)}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: statusCfg.bg,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
          <Typography variant="caption">
            {project.completion_percentage ?? 0}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// ============================================================================
// Main component
// ============================================================================

const PROJECTS_QUERY_KEY = "all-projects-list";

export default function AllProjectsList() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProjectTypeId, setFilterProjectTypeId] = useState<string>("");

  const formConfig = useMemo(() => getAddProjectFormConfig(), []);

  // ── Table params ─────────────────────────────────────────────────────────
  const params = ProjectsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ── Fetch projects ───────────────────────────────────────────────────────
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
      const response = await apiClient.get(`${baseURL}/projects`, {
        params: {
          page: params.page,
          per_page: params.limit,
          ...(params.search ? { name: params.search } : {}),
          ...(filterStatus !== "" ? { status: filterStatus } : {}),
          ...(filterProjectTypeId ? { project_type_id: filterProjectTypeId } : {}),
        },
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
        name: "اجراءات",
        sortable: false,
        render: () => (
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
                اجراء
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>
              <EditIcon className="w-4 h-4 ml-2" />
              تعديل
            </MenuItem>
            <MenuItem onClick={() => {}}>
              <Trash2 className="w-4 h-4 ml-2" />
              حذف
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    []
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
    <Button
      variant="contained"
      color="primary"
      onClick={() => setAddProjectOpen(true)}
    >
      اضافة مشروع
    </Button>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* ── Search filter section ─────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ mb: 2, textAlign: "right" }}
        >
          فلتر البحث
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          {/* اسم المشروع is handled by the table's built-in search */}
          <FormControl size="small" fullWidth>
            <InputLabel>تصنيف المشروع</InputLabel>
            <Select
              value={filterProjectTypeId}
              label="تصنيف المشروع"
              onChange={(e) => setFilterProjectTypeId(e.target.value)}
            >
              <MenuItem value="">الكل</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>حالة المشروع</InputLabel>
            <Select
              value={filterStatus}
              label="حالة المشروع"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="1">جاري</MenuItem>
              <MenuItem value="0">قيد التنفيذ</MenuItem>
              <MenuItem value="-1">متوقف</MenuItem>
              <MenuItem value="2">مكتمل</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* ── Table view ───────────────────────────────────────────────────── */}
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
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ── Add Project Sheet ─────────────────────────────────────────────── */}
      <SheetFormBuilder
        config={formConfig}
        isOpen={addProjectOpen}
        onOpenChange={setAddProjectOpen}
        onSuccess={() => setAddProjectOpen(false)}
      />
    </Box>
  );
}
