"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLocale } from "next-intl";
import { useProjectRolesTranslations } from "../useProjectRolesTranslations";
import ProjectCreateRoleForm from "./ProjectCreateRoleForm";

export interface EditRoleData {
  id: string;
  name: string;
  permissionIds: string[];
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
  const t = useProjectRolesTranslations();

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
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
        <ProjectCreateRoleForm
          projectId={projectId}
          editMode={
            editRole
              ? {
                  roleId: editRole.id,
                  roleName: editRole.name,
                  permissionIds: editRole.permissionIds,
                }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </SheetContent>
    </Sheet>
  );
}
