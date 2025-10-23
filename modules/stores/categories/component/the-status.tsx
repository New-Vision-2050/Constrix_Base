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
import { response } from "@/app/[locale]/(main)/users/data";

const TheStatus = ({
  theStatus,
  id,
}: {
  theStatus: "active" | "inActive";
  id: string;
}) => {
  const t = useTranslations();
  const [isActive, setIsActive] = useState(!!theStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [tempIsActive, setTempIsActive] = useState(isActive); // Store the original state
  const { toast } = useToast();
  const { can } = usePermissions();

  const handleConfirm = async () => {
    try {
      const response = await apiClient.patch(
        `/ecommerce/dashboard/categories/${id}/toggle-active`
      );

      if (response.status === 200) {
        setIsActive(tempIsActive);
        setShowDialog(false);
        toast({
          title: t("category.success") || "Success",
          description: tempIsActive
            ? t("category.activatedSuccessfully") ||
              "Category activated successfully"
            : t("category.deactivatedSuccessfully") ||
              "Category deactivated successfully",
        });
      } else {
        toast({
          title: t("category.error") || "Error",
          description:
            t("category.failedToUpdateStatus") || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("category.error") || "Error",
        description:
          t("category.failedToUpdateStatus") || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsActive(!tempIsActive); // Revert to the original state
    setShowDialog(false);
  };

  const handleChange = (checked: boolean) => {
    setTempIsActive(checked); // Store the current state before the change
    setShowDialog(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Label htmlFor={`${id}-switcher`} className="font-normal">
          {t("category.active") || "Active"}
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
              ? t("category.areYouSureReactivate") ||
                "Are you sure you want to reactivate this category?"
              : t("category.areYouSureDeactivate") ||
                "Are you sure you want to deactivate this category?"
          }
        />
      </Dialog>
    </>
  );
};

export default TheStatus;
