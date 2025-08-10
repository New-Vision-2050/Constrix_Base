"use client";

import { useState } from "react";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import { Dialog } from "@/components/ui/dialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useToast } from "@/modules/table/hooks/use-toast";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface TableStatusSwitcherProps {
  id: string;
  label: string;
  initialStatus: boolean;
  confirmAction: (isActive: boolean, activationDate?: string) => Promise<void>;
  confirmDescription: (isActive: boolean) => string;
  showDatePicker?: (isActive: boolean) => boolean;
  onError?: (error: Error) => void;
}

const TableStatusSwitcher: React.FC<TableStatusSwitcherProps> = ({
  id,
  label,
  initialStatus,
  confirmAction,
  confirmDescription,
  showDatePicker = () => false,
  onError,
}) => {
  // declare and define component state and variables
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(initialStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [tempIsActive, setTempIsActive] = useState(isActive);
  const { can } = usePermissions();

  // declare and define component helper methods
  const handleConfirm = async (activationDate?: string) => {
    try {
      await confirmAction(tempIsActive, activationDate);
      setIsActive(tempIsActive);
      setShowDialog(false);
      toast({
        title: "Success",
        description: "Status updated successfully.",
      });
    } catch (error) {
      // show feedback message
      toast({
        title: "Error",
        description: "Failed to update status",
      });
      setTempIsActive(isActive); // Revert to the original state
      setShowDialog(false);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  const handleCancel = () => {
    setTempIsActive(isActive); // Revert to the original state
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
          {label}
        </Label>
        <Switch
          id={`${id}-switcher`}
          checked={isActive}
          onCheckedChange={handleChange}
          disabled={!can(PERMISSIONS.permission.activate)}
        />
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <ConfirmationDialog
          open={showDialog}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          description={confirmDescription(tempIsActive)}
          showDatePicker={showDatePicker(tempIsActive)}
        />
      </Dialog>
    </>
  );
};

export default TableStatusSwitcher;
