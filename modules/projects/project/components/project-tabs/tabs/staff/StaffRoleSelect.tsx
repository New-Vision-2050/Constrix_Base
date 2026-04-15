"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, MenuItem, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { useProjectRoles } from "@/modules/projects/project/query/useProjectRoles";
import { projectEmployeesQueryKey } from "@/modules/projects/project/query/useProjectEmployees";
import type { ProjectEmployeeRoleSummary } from "./types";

type Props = {
  projectId: string | undefined;
  /** Project–employee assignment id (row `id` from employees list) */
  assignmentId: string;
  /** Current role from employees list API (`project_role`) */
  projectRole?: ProjectEmployeeRoleSummary | null;
};

export default function StaffRoleSelect({
  projectId,
  assignmentId,
  projectRole,
}: Props) {
  const t = useTranslations("project");
  const queryClient = useQueryClient();
  const { data: roles, isLoading, isFetching } = useProjectRoles(projectId);

  const serverRoleId = projectRole?.id ?? "";

  const [value, setValue] = useState(serverRoleId);

  useEffect(() => {
    setValue(projectRole?.id ?? "");
  }, [projectRole?.id, assignmentId]);

  const assignMutation = useMutation({
    mutationFn: (project_role_id: string) =>
      AllProjectsApi.assignProjectEmployeeRole(assignmentId, {
        project_role_id,
      }),
    onSuccess: (res) => {
      const msg = res.data?.message;
      toast.success(
        typeof msg === "string" && msg.trim() ? msg : t("staff.roleAssignSuccess"),
      );
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectEmployeesQueryKey(projectId),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error?.response?.data?.message ?? t("staff.roleAssignError"),
      );
      setValue(serverRoleId);
    },
  });

  const activeRoles = useMemo(
    () => (roles ?? []).filter((r) => r.is_active),
    [roles],
  );

  /** Options in the menu: active roles plus current assignment if missing (e.g. inactive role). */
  const menuRoles = useMemo(() => {
    const list = activeRoles.map((r) => ({ id: r.id, name: r.name }));
    if (
      projectRole?.id &&
      !list.some((r) => r.id === projectRole.id)
    ) {
      return [{ id: projectRole.id, name: projectRole.name }, ...list];
    }
    return list;
  }, [activeRoles, projectRole]);

  const loading = Boolean(projectId) && (isLoading || isFetching);
  const pending = assignMutation.isPending;

  const displayNameForValue = (id: string) => {
    if (!id) {
      return (
        <Box component="span" sx={{ color: "text.secondary" }}>
          {t("staff.rolePlaceholder")}
        </Box>
      );
    }
    const fromMenu = menuRoles.find((r) => r.id === id);
    if (fromMenu) return fromMenu.name;
    return id;
  };

  const handleChange = (next: string) => {
    if (next === "") {
      setValue(serverRoleId);
      return;
    }
    if (next === serverRoleId) return;
    setValue(next);
    assignMutation.mutate(next);
  };

  if (!projectId) {
    return (
      <TextField
        select
        size="small"
        disabled
        value=""
        sx={{ minWidth: 140, maxWidth: 260 }}
      >
        <MenuItem value="">—</MenuItem>
      </TextField>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 140,
          minHeight: 40,
        }}
      >
        {projectRole?.name ? (
          <Box
            component="span"
            sx={{
              fontSize: "body2.fontSize",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={projectRole.name}
          >
            {projectRole.name}
          </Box>
        ) : null}
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <TextField
      select
      size="small"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={pending}
      SelectProps={{
        displayEmpty: true,
        renderValue: (selected) =>
          displayNameForValue(typeof selected === "string" ? selected : ""),
      }}
      sx={{
        minWidth: 140,
        maxWidth: 260,
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: 2,
        },
      }}
    >
      <MenuItem value="">
        <Box component="span" sx={{ color: "text.secondary" }}>
          {t("staff.rolePlaceholder")}
        </Box>
      </MenuItem>
      {menuRoles.map((role) => (
        <MenuItem key={role.id} value={role.id}>
          {role.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
