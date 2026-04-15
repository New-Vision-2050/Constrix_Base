"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectRolesApi } from "@/services/api/projects/project-roles";
import { projectRolesQueryKey } from "@/modules/projects/project/query/useProjectRoles";
import RolesTable from "./components/RolesTable";
import ProjectRoleDrawer, {
  type EditRoleData,
} from "./components/ProjectRoleDrawer";

export default function RolesTab() {
  const t = useTranslations("project.roles");
  const { projectId } = useProject();
  const queryClient = useQueryClient();

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

  return (
    <Box sx={{ p: 3 }}>
      <RolesTable
        onCreateRole={handleCreateRole}
        onEditRole={handleEditRole}
        onDeleteRole={(id) => setDeleteRoleId(id)}
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
