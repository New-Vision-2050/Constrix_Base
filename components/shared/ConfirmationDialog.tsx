import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InfoIcon from "@/public/icons/info";
import DateField from "@/modules/form-builder/components/fields/DateField";
import { FieldConfig } from "@/modules/form-builder/types/formTypes";
import LoaddingDots from "@/components/ui/loadding-dots";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (activationDate: string) => Promise<void>;
  title: string;
  description: string;
  showDatePicker?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  showDatePicker,
}) => {
  const [activationDate, setActivationDate] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(activationDate);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldConfig: FieldConfig = {
    name: "activationDate",
    label: "Activation Date",
    type: "date",
    placeholder: "Select Activation Date",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-9">
          <DialogTitle>
            <button
              className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
            <InfoIcon />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <h3 className="text-center !text-[#EAEAFFDE] !text-2xl mb-9">
            {description}
          </h3>
        </DialogDescription>
        {showDatePicker && (
          <DateField
            field={fieldConfig}
            value={activationDate}
            onChange={setActivationDate}
            onBlur={() => {}}
            allowRangeSelection
          />
        )}
        <DialogFooter className="!items-center !justify-center gap-3">
          <Button onClick={handleConfirm} className="w-32 h-10" disabled={isLoading}>
            {isLoading ? <LoaddingDots /> : "Confirm"}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-32 h-10" disabled={isLoading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
