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
  onStatusChange,
}: {
  theStatus: "active" | "inActive";
  id: string;
  onStatusChange?: () => void;
}) => {
  const t = useTranslations();
  const [isActive, setIsActive] = useState(!!theStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [tempIsActive, setTempIsActive] = useState(isActive); // Store the original state
  const { toast } = useToast();
  const { can } = usePermissions();
  const handleConfirm = async (activationDate: string) => {
    try {
      const response = await apiClient.put(`/companies/${id}/activate`, {
        is_active: Number(tempIsActive),
        date_activate: activationDate,
      });

      if (response.status === 200) {
        setIsActive(tempIsActive);
        setShowDialog(false);
        // Trigger statistics refetch if callback is provided
        onStatusChange?.();
      } else {
        toast({
          title: "Error",
          description: "Failed to update status",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update status",
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
          {t("Companies.Active")}
        </Label>
        <Switch
          id={`${id}-switcher`}
          checked={isActive}
          onCheckedChange={handleChange}
          disabled={!can(PERMISSIONS.company.update)}
        />
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <ConfirmationDialog
          open={showDialog}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          // title={isActive ? t("Companies.AreYouSureReactivate") : t("Companies.AreYouSureDeactivate")}
          description={
            !isActive
              ? t("Companies.AreYouSureReactivate")
              : t("Companies.AreYouSureDeactivate")
          }
          showDatePicker={!isActive}
        />
      </Dialog>
    </>
  );
};

export default TheStatus;
