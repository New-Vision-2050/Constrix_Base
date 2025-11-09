"use client";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/ui/dialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { apiClient } from "@/config/axios-config";
import { useToast } from "@/modules/table/hooks/use-toast";

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

  const handleConfirm = async () => {
    try {
      const response = await apiClient.patch(
        `/ecommerce/dashboard/social_media/${id}/toggle-status`
      );

      if (response.status === 200) {
        setIsActive(tempIsActive);
        setShowDialog(false);
        toast({
          title: t("socialMedia.success") || "Success",
          description: tempIsActive
            ? t("socialMedia.activatedSuccessfully") ||
              "Social media activated successfully"
            : t("socialMedia.deactivatedSuccessfully") ||
              "Social media deactivated successfully",
        });
      } else {
        toast({
          title: t("socialMedia.error") || "Error",
          description:
            t("socialMedia.failedToUpdateStatus") || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("socialMedia.error") || "Error",
        description:
          t("socialMedia.failedToUpdateStatus") || "Failed to update status",
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
          {t("socialMedia.active") || "Active"}
        </Label>
        <Switch
          id={`${id}-switcher`}
          checked={isActive}
          onCheckedChange={handleChange}
        />
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <ConfirmationDialog
          open={showDialog}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          description={
            !isActive
              ? t("socialMedia.areYouSureReactivate") ||
                "Are you sure you want to reactivate this social media?"
              : t("socialMedia.areYouSureDeactivate") ||
                "Are you sure you want to deactivate this social media?"
          }
        />
      </Dialog>
    </>
  );
};

export default TheStatus;
