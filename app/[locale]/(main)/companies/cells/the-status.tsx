"use client";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { Input } from "@/components/ui/input";
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
  const [activationDate, setActivationDate] = useState("");
  const { toast } = useToast();

  const handleConfirm = async (activationDate: string) => {
    try {
      const response = await apiClient.put(`/api/companies/${id}/status`, {
        isActive: tempIsActive,
        activationDate: activationDate,
      });

      if (response.status === 200) {
        setIsActive(tempIsActive);
        setShowDialog(false);
      } else {
        // Handle error
        console.error("Failed to update status");
        toast({
          title: "Error",
          description: "Failed to update status",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
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

  const deleteUrl = "/api/update-company-status"; // Replace with the actual update URL

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
        />
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <ConfirmationDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onConfirm={handleConfirm}
          title={t("Companies.Confirmation")}
          description={t("Companies.AreYouSure")}
          showDatePicker={!isActive}
        />
      </Dialog>
    </>
  );
};

export default TheStatus;
