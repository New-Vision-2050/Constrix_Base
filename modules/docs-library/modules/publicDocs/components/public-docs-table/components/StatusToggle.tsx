import { useTranslations } from "next-intl";
import ToggleControl from "@/modules/clients/components/ToggleControl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useState } from "react";

interface StatusToggleProps {
  isFolder: boolean;
  onStatusChange: (checked: boolean) => void;
  isPending?: boolean;
  rowStatus: number;
  setRowStatus: React.Dispatch<React.SetStateAction<number>>
}

export default function StatusToggle({
  isFolder,
  onStatusChange,
  isPending = false,
  rowStatus,
  setRowStatus,
}: StatusToggleProps) {
  const t = useTranslations("docs-library.publicDocs.table");
  const { can } = usePermissions();

  const hasPermission = isFolder
    ? can(PERMISSIONS.library.folder.activate)
    : can(PERMISSIONS.library.file.activate);

    
  if (!hasPermission) {
    return (
      <div className="w-full h-full bg-muted/30">
        {rowStatus === 1 ? t("active") : t("inactive")}
      </div>
    );
  }

  return (
    <ToggleControl
      activeLabel={t("active")}
      inactiveLabel={t("inactive")}
      checked={rowStatus === 1}
      onChange={async (checked) => {
        try {
          await onStatusChange(checked);
          setRowStatus(checked ? 1 : 0);
        } catch (error) {
          console.log(error);
        }
      }}
      disabled={isPending || !hasPermission}
    />
  );
}
