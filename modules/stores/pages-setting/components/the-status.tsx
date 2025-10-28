"use client";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/ui/dialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { apiClient } from "@/config/axios-config";
import { useToast } from "@/modules/table/hooks/use-toast";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

const TheStatus = ({
  theStatus,
  id,
  type = "main",
}: {
  theStatus: "active" | "inActive";
  id: string;
  type?: "main" | "discounts" | "new-arrivals" | "contact" | "about-us" | "new-features";
}) => {
  const t = useTranslations();
  const [isActive, setIsActive] = useState(!!theStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [tempIsActive, setTempIsActive] = useState(isActive);
  const { toast } = useToast();
  const { can } = usePermissions();

  const handleConfirm = async () => {
    try {
      const endpoint = `/ecommerce/dashboard/pages/${type}/${id}/toggle-status`;

      const response = await apiClient.patch(endpoint);

      if (response.status === 200) {
        setIsActive(tempIsActive);
        setShowDialog(false);
        toast({
          title: t("pages.success") || "Success",
          description: tempIsActive
            ? t("pages.activatedSuccessfully") || "Page activated successfully"
            : t("pages.deactivatedSuccessfully") ||
              "Page deactivated successfully",
        });
      } else {
        toast({
          title: t("pages.error") || "Error",
          description:
            t("pages.failedToUpdateStatus") || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("pages.error") || "Error",
        description:
          t("pages.failedToUpdateStatus") || "Failed to update status",
        variant: "destructive",
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
          {t("pages.active") || "Active"}
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
            !isActive
              ? t("pages.areYouSureReactivate") ||
                "Are you sure you want to reactivate this page?"
              : t("pages.areYouSureDeactivate") ||
                "Are you sure you want to deactivate this page?"
          }
        />
      </Dialog>
    </>
  );
};

export default TheStatus;
