"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useProjectRolesTranslations } from "./useProjectRolesTranslations";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectRolesApi } from "@/services/api/projects/project-roles";
import { projectRolesQueryKey } from "@/modules/projects/project/query/useProjectRoles";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  PROJECT_ROLE_CREATE,
  PROJECT_ROLE_DELETE,
  PROJECT_ROLE_LIST,
  PROJECT_ROLE_UPDATE,
  PROJECT_ROLE_VIEW,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import {
  hasAnyProjectPermissionKey,
  hasProjectPermissionKey,
} from "@/modules/projects/project/utils/projectMyPermissions";
import RolesTable from "./components/RolesTable";
import ProjectRoleDrawer, {
  type EditRoleData,
} from "./components/ProjectRoleDrawer";

export default function RolesTab() {
  const t = useProjectRolesTranslations();
  const tCommon = useTranslations("common");
  const { projectId } = useProject();
  const queryClient = useQueryClient();

  const { data: flatPerms, isLoading: isLoadingPerms } =
    useProjectMyPermissionsFlat(projectId);

  const rolePermissions = useMemo(
    () => ({
      canList: hasAnyProjectPermissionKey(flatPerms, [
        PROJECT_ROLE_VIEW,
        PROJECT_ROLE_LIST,
      ]),
      canCreate: hasProjectPermissionKey(flatPerms, PROJECT_ROLE_CREATE),
      canEdit: hasProjectPermissionKey(flatPerms, PROJECT_ROLE_UPDATE),
      canDelete: hasProjectPermissionKey(flatPerms, PROJECT_ROLE_DELETE),
    }),
    [flatPerms],
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRole, setEditRole] = useState<EditRoleData | undefined>();
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (roleId: string) =>
      ProjectRolesApi.delete(projectId, roleId),
    onSuccess: (res) => {
      setDeleteRoleId(null);
      const msg = res.data?.message;
      toast.success(typeof msg === "string" && msg.trim() ? msg : undefined);
      queryClient.invalidateQueries({
        queryKey: projectRolesQueryKey(projectId),
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? undefined);
    },
  });

  const handleCreateRole = () => {
    setEditRole(undefined);
    setDrawerOpen(true);
  };

  const handleEditRole = (role: EditRoleData) => {
    setEditRole(role);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditRole(undefined);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: projectRolesQueryKey(projectId),
    });
  };

  if (!projectId) {
    return null;
  }

  if (isLoadingPerms) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!rolePermissions.canList) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{tCommon("noProjectTabPermission")}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <RolesTable
        onCreateRole={handleCreateRole}
        onEditRole={handleEditRole}
        onDeleteRole={(id) => setDeleteRoleId(id)}
        permissions={rolePermissions}
      />

      <ProjectRoleDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        projectId={projectId}
        editRole={editRole}
        onSuccess={handleSuccess}
      />

      <Dialog
        open={deleteRoleId !== null}
        onClose={() => {
          if (deleteMutation.isPending) return;
          setDeleteRoleId(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("deleteDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t("deleteDialogBody")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteRoleId(null)}
            disabled={deleteMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (deleteRoleId) {
                deleteMutation.mutate(deleteRoleId);
              }
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
