"use client";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/ui/dialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useToast } from "@/modules/table/hooks/use-toast";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CompanyDashboardNewsApi } from "@/services/api/company-dashboard/news";

const TheStatus = ({
  theStatus,
  id,
}: {
  theStatus: "active" | "inActive";
  id: string;
}) => {
  const t = useTranslations("content-management-system.news");
  const [isActive, setIsActive] = useState(!!theStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [tempIsActive, setTempIsActive] = useState(isActive);
  const { toast } = useToast();
  const { can } = usePermissions();

  const handleConfirm = async () => {
    try {
      await CompanyDashboardNewsApi.toggleActive(id);
      setIsActive(tempIsActive);
      setShowDialog(false);
      toast({
        title: t("success") || "Success",
        description: tempIsActive
          ? t("activatedSuccessfully")
          : t("deactivatedSuccessfully"),
      });
    } catch {
      toast({
        title: t("error") || "Error",
        description: t("failedToUpdateStatus"),
      });
    }
  };

  const handleCancel = () => {
    setIsActive(!tempIsActive);
    setShowDialog(false);
  };

  const handleChange = (checked: boolean) => {
    setTempIsActive(checked);
    setShowDialog(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Label htmlFor={`${id}-switcher`} className="font-normal">
          {t("table.status")}
        </Label>
        <Switch
          id={`${id}-switcher`}
          checked={isActive}
          onCheckedChange={handleChange}
          disabled={!can(PERMISSIONS.package.update)}
        />
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <ConfirmationDialog
          open={showDialog}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          description={
            !isActive ? t("areYouSureReactivate") : t("areYouSureDeactivate")
          }
        />
      </Dialog>
    </>
  );
};

export default TheStatus;
