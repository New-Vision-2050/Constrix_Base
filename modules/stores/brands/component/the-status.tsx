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
        `/ecommerce/dashboard/brands/${id}/toggle-active`
      );

      if (response.status === 200) {
        setIsActive(tempIsActive);
        setShowDialog(false);
        toast({
          title: t("brand.success") || "Success",
          description: tempIsActive
            ? t("brand.activatedSuccessfully")
            : t("brand.deactivatedSuccessfully"),
        });
      } else {
        toast({
          title: t("brand.error") || "Error",
          description: t("brand.failedToUpdateStatus"),
        });
      }
    } catch {
      toast({
        title: t("brand.error") || "Error",
        description: t("brand.failedToUpdateStatus"),
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
          {t("labels.active")}
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
              ? t("brand.areYouSureReactivate")
              : t("brand.areYouSureDeactivate")
          }
        />
      </Dialog>
    </>
  );
};

export default TheStatus;
