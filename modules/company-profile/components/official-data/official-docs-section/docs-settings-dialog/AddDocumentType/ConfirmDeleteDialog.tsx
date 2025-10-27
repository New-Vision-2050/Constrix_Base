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
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("companyProfile.officialDocs.docsSettingsDialog");

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
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
            </div>
          </DialogTitle>
          <InfoIcon />
        </DialogHeader>
        <DialogDescription asChild>
          <p className="text-center text-lg mb-3">{title}</p>
        </DialogDescription>
        <DialogFooter className="!items-center !justify-center gap-3">
          <Button
            onClick={handleConfirm}
            className="w-32 h-10"
            loading={isLoading}
          >
            {t("confirm")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-32 h-10"
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
