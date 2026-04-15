"use client";

import { useMemo, useState } from "react";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import {
  CheckCircle,
  EditIcon,
  List,
  TrendingUp,
  Trash2,
  Users,
} from "lucide-react";
import { useProjectRolesTranslations } from "../useProjectRolesTranslations";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { Switch } from "@/components/ui/switch";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectRoles } from "@/modules/projects/project/query/useProjectRoles";
import type { ProjectRoleRow } from "../types";
import type { ProjectRoleListItem } from "@/services/api/projects/project-roles/types/response";
import { extractAllIds } from "./ProjectCreateRoleForm";

const TableLayout = HeadlessTableLayout<ProjectRoleRow>("project-roles-table");

function mapRoleToRow(role: ProjectRoleListItem): ProjectRoleRow {
  return {
    id: role.id,
    name: role.name,
    slug: role.slug,
    description: role.description,
    is_active: role.is_active,
    is_default: role.is_default,
    permissions_count: role.permissions_count,
    permissions: role.permissions,
    created_at: role.created_at,
  };
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 3,
        py: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        flex: 1,
        minWidth: 200,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "50%",
          bgcolor: color,
          color: "white",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ textAlign: "end", flex: 1 }}>
        <Box sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
          {title}
        </Box>
        <Box sx={{ fontSize: "1.5rem", fontWeight: 700 }}>{value}</Box>
      </Box>
    </Box>
  );
}

import type { EditRoleData } from "./ProjectRoleDrawer";

interface RolesTableProps {
  onCreateRole: () => void;
  onEditRole: (role: EditRoleData) => void;
  onDeleteRole: (roleId: string) => void;
}

export default function RolesTable({
  onCreateRole,
  onEditRole,
  onDeleteRole,
}: RolesTableProps) {
  const t = useProjectRolesTranslations();
  const { projectId } = useProject();

  const [filterRoleName, setFilterRoleName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: roles, isLoading } = useProjectRoles(projectId);

  const allRows = useMemo(() => (roles ?? []).map(mapRoleToRow), [roles]);

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (
        filterRoleName &&
        !row.name.toLowerCase().includes(filterRoleName.toLowerCase())
      )
        return false;
      if (filterStatus === "active" && !row.is_active) return false;
      if (filterStatus === "inactive" && row.is_active) return false;
      return true;
    });
  }, [allRows, filterRoleName, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / params.limit));
  const totalItems = filteredRows.length;

  const totalRoles = allRows.length;
  const totalMainRoles = allRows.filter((r) => r.is_default).length;
  const totalActiveRoles = allRows.filter((r) => r.is_active).length;
  const totalInactiveRoles = allRows.filter((r) => !r.is_active).length;

  const roleNames = useMemo(() => {
    const names = new Set<string>();
    allRows.forEach((r) => names.add(r.name));
    return Array.from(names).sort();
  }, [allRows]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("roleName"),
        sortable: false,
        render: (row: ProjectRoleRow) => (
          <span className="font-medium">{row.name}</span>
        ),
      },
      {
        key: "permissions_count",
        name: t("permissionsCount"),
        sortable: false,
        render: (row: ProjectRoleRow) => <span>{row.permissions_count}</span>,
      },
      {
        key: "status",
        name: t("status"),
        sortable: false,
        render: (row: ProjectRoleRow) => (
          <div className="flex items-center gap-2">
            <Switch checked={row.is_active} disabled />
            <span className="text-sm">
              {row.is_active ? t("active") : t("inactive")}
            </span>
          </div>
        ),
      },
      {
        key: "actions",
        name: t("actions"),
        sortable: false,
        render: (row: ProjectRoleRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {t("action")}
              </Button>
            )}
          >
            <MenuItem
              onClick={() =>
                onEditRole({
                  id: row.id,
                  name: row.name,
                  permissionIds:
                    row.permissions && !Array.isArray(row.permissions)
                      ? extractAllIds(row.permissions)
                      : [],
                })
              }
            >
              <EditIcon className="w-4 h-4 me-2" />
              {t("edit")}
            </MenuItem>
            <MenuItem
              onClick={() => onDeleteRole(row.id)}
              sx={{ color: "error.main" }}
            >
              <Trash2 className="w-4 h-4 me-2" />
              {t("delete")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [t, onEditRole, onDeleteRole],
  );

  const state = TableLayout.useTableState({
    data: paginatedData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ProjectRoleRow) => row.id,
    loading: isLoading,
    searchable: true,
    onExport: async () => {},
  });

  const filterSx = {
    flex: 1,
    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
  } as const;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3 }}
        flexWrap="wrap"
        useFlexGap
      >
        <StatsCard
          title={t("totalRoles")}
          value={totalRoles}
          icon={<Users className="h-5 w-5" />}
          color="#7c3aed"
        />
        <StatsCard
          title={t("totalMainRoles")}
          value={totalMainRoles}
          icon={<CheckCircle className="h-5 w-5" />}
          color="#16a34a"
        />
        <StatsCard
          title={t("totalActiveRoles")}
          value={totalActiveRoles}
          icon={<List className="h-5 w-5" />}
          color="#ca8a04"
        />
        <StatsCard
          title={t("totalInactiveRoles")}
          value={totalInactiveRoles}
          icon={<TrendingUp className="h-5 w-5" />}
          color="#6366f1"
        />
      </Stack>

      <TableLayout
        filters={
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <TextField
                select
                size="small"
                label={t("filterRoleName")}
                value={filterRoleName}
                onChange={(e) => {
                  setFilterRoleName(e.target.value);
                  params.setPage(1);
                }}
                sx={filterSx}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                {roleNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label={t("filterRoleStatus")}
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  params.setPage(1);
                }}
                sx={filterSx}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                <MenuItem value="active">{t("active")}</MenuItem>
                <MenuItem value="inactive">{t("inactive")}</MenuItem>
              </TextField>
            </Stack>

            <TableLayout.TopActions
              state={state}
              customActions={
                <Button variant="contained" onClick={onCreateRole}>
                  {t("createRole")}
                </Button>
              }
            />
          </Stack>
        }
        table={
          <TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
        }
        pagination={<TableLayout.Pagination state={state} />}
      />
    </Box>
  );
}
