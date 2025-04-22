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

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (activationDate: string) => Promise<void>;
  title?: string;
  description?: string;
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
    name: "date_activate",
    label: "هل تريد تاكيد تنشيط الشركة؟",
    type: "date",
    placeholder: "اختر تنشيط الشركة؟",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center justify-center mb-4">
          <DialogTitle asChild>
            <div>
              <button
                className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
                onClick={onClose}
              >
                ✕
              </button>
              {(title &&
                  <h2 className="text-center !text-xl mt-4">{title}</h2>)}
              </div>
          </DialogTitle>
          <InfoIcon />
        </DialogHeader>
        <DialogDescription asChild>
          <h3 className="text-center !text-2xl mb-3">
            {description}
          </h3>
        </DialogDescription>
        {showDatePicker && (
          <DateField
            field={fieldConfig}
            value={activationDate}
            onChange={setActivationDate}
            onBlur={() => {}}
            fromDate={new Date()}
          />
        )}
        <DialogFooter className="!items-center !justify-center gap-3">
          <Button
            onClick={handleConfirm}
            className="w-32 h-10"
            loading={isLoading}
            {...(showDatePicker ? { disabled: !!!activationDate } : {})}
          >
            تاكيد
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-32 h-10"
            disabled={isLoading}
          >
            الغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
