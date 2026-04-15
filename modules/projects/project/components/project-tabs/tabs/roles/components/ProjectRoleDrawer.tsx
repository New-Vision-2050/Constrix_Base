"use client";

import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProjectRolesApi } from "@/services/api/projects/project-roles";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import ProjectCreateRoleForm, { extractAllIds } from "./ProjectCreateRoleForm";

export interface EditRoleData {
  id: string;
  name: string;
}

type Props = {
  open: boolean;
  onClose: VoidFunction;
  projectId: string;
  editRole?: EditRoleData;
  onSuccess?: () => void;
};

export default function ProjectRoleDrawer({
  open,
  onClose,
  projectId,
  editRole,
  onSuccess,
}: Props) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("project.roles");

  const {
    data: roleDetailsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project-role-details", projectId, editRole?.id, open],
    queryFn: () => ProjectRolesApi.show(projectId, editRole!.id),
    enabled: open && !!editRole,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (open && editRole) {
      refetch();
    }
  }, [open, editRole, refetch]);

  const renderContent = () => {
    if (!editRole) {
      return (
        <ProjectCreateRoleForm
          projectId={projectId}
          onSuccess={() => {
            onClose();
            onSuccess?.();
          }}
        />
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p>{t("loading")}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p>{t("errorLoadingRole")}</p>
          </div>
        </div>
      );
    }

    const roleTree = roleDetailsData?.data?.payload;
    const permissionIds =
      roleTree && !Array.isArray(roleTree) ? extractAllIds(roleTree) : [];

    return (
      <ProjectCreateRoleForm
        projectId={projectId}
        editMode={{
          roleId: editRole.id,
          roleName: editRole.name,
          permissionIds,
        }}
        onSuccess={() => {
          onClose();
          onSuccess?.();
        }}
      />
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side={isRTL ? "left" : "right"}
        style={{ width: "80vw", maxWidth: "80vw" }}
        className="overflow-y-auto max-h-screen"
      >
        <SheetHeader className="mb-4">
          <SheetTitle>
            {editRole ? t("editRole") : t("createRoleTitle")}
          </SheetTitle>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
