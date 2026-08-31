"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AllProjectsApi } from "@/services/api/projects/all-projects";
import { projectEmployeesQueryKey } from "@/modules/projects/project/query/useProjectEmployees";
import { projectMyPermissionsFlatQueryKey } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import { useProjectRoles } from "@/modules/projects/project/query/useProjectRoles";
import type { Employee } from "./types";
import type { StaffRoleOption } from "./StaffRoleSelect";

function resolveApiMessage(error: unknown, fallback: string): string {
  const message = (
    error as { response?: { data?: { message?: unknown } } }
  )?.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message.trim();
  if (
    message &&
    typeof message === "object" &&
    "description" in message &&
    typeof (message as { description: unknown }).description === "string"
  ) {
    const description = (message as { description: string }).description.trim();
    if (description) return description;
  }
  return fallback;
}

type Props = {
  open: boolean;
  employee: Employee | null;
  projectId: string | undefined;
  canChangeRole: boolean;
  onClose: () => void;
};

export default function EditStaffDialog({
  open,
  employee,
  projectId,
  canChangeRole,
  onClose,
}: Props) {
  const t = useTranslations("project");
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<StaffRoleOption | null>(
    null,
  );

  const { data: roles, isLoading: loadingRoles } = useProjectRoles(
    open && canChangeRole ? projectId : undefined,
  );

  const roleOptions = useMemo((): StaffRoleOption[] => {
    const active = (roles ?? [])
      .filter((r) => r.is_active)
      .map((r) => ({ id: r.id, name: r.name, is_active: r.is_active }));
    const current = employee?.projectRole;
    if (current?.id && !active.some((r) => r.id === current.id)) {
      return [
        { id: current.id, name: current.name, is_active: true },
        ...active,
      ];
    }
    return active;
  }, [roles, employee?.projectRole]);

  useEffect(() => {
    if (!open || !employee) {
      setSelectedRole(null);
      return;
    }
    const currentId = employee.projectRole?.id;
    if (!currentId) {
      setSelectedRole(null);
      return;
    }
    setSelectedRole(roleOptions.find((r) => r.id === currentId) ?? null);
  }, [open, employee, roleOptions]);

  const saveMutation = useMutation({
    mutationFn: (project_role_id: string) =>
      AllProjectsApi.assignProjectEmployeeRole(employee!.id, {
        project_role_id,
      }),
    onSuccess: (res) => {
      const msg = res.data?.message;
      toast.success(
        typeof msg === "string" && msg.trim()
          ? msg
          : t("staff.roleAssignSuccess"),
      );
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectEmployeesQueryKey(projectId),
        });
        queryClient.invalidateQueries({
          queryKey: projectMyPermissionsFlatQueryKey(projectId),
        });
      }
      onClose();
    },
    onError: (error: unknown) => {
      toast.error(resolveApiMessage(error, t("staff.roleAssignError")));
    },
  });

  const handleClose = () => {
    if (saveMutation.isPending) return;
    onClose();
  };

  const currentRoleId = employee?.projectRole?.id ?? "";
  const nextRoleId = selectedRole?.id ?? "";
  const canSave =
    canChangeRole &&
    Boolean(nextRoleId) &&
    nextRoleId !== currentRoleId &&
    !saveMutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("staff.editStakeholder")}</DialogTitle>
      <DialogContent>
        {employee ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("staff.employeeName")}
              </Typography>
              <Typography variant="body1">{employee.user.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("staff.company")}
              </Typography>
              <Typography variant="body1">{employee.company.name}</Typography>
            </Box>
            {canChangeRole ? (
              loadingRoles ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Autocomplete
                  options={roleOptions}
                  value={selectedRole}
                  onChange={(_, value) => setSelectedRole(value)}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  disabled={saveMutation.isPending}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("staff.role")}
                      placeholder={t("staff.searchRolePlaceholder")}
                    />
                  )}
                />
              )
            ) : (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("staff.role")}
                </Typography>
                <Typography variant="body1">
                  {employee.projectRole?.name?.trim() || "—"}
                </Typography>
              </Box>
            )}
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={saveMutation.isPending}>
          {t("cancel")}
        </Button>
        {canChangeRole ? (
          <Button
            variant="contained"
            disabled={!canSave}
            onClick={() => {
              if (selectedRole) saveMutation.mutate(selectedRole.id);
            }}
          >
            {saveMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t("save")
            )}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
