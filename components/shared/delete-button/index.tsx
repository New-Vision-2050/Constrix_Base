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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import InfoIcon from "@/public/icons/InfoIcon";

type DeleteButtonProps = {
  message?: string;
  onDelete: ({ onClose }: { onClose: VoidFunction }) => void | Promise<void>;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  translations?: {
    deleteSuccess?: string;
    deleteError?: string;
    deleteCancelled?: string;
  };
};

const DeleteButton: React.FC<DeleteButtonProps> = ({
  message,
  onDelete,
  open: externalOpen,
  setOpen: setExternalOpen,
  translations,
}) => {
  const t = useTranslations("labels");
  const [localOpen, setLocalOpen] = useState(false);

  const dialogMessage = message ?? t("deleteConfirmMessage");

  // Use external state if provided, otherwise use local state
  const isOpen = externalOpen !== undefined ? externalOpen : localOpen;

  const handleClose = () => {
    if (setExternalOpen) {
      setExternalOpen(false);
    } else {
      setLocalOpen(false);
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await onDelete({ onClose: handleClose });
      toast.success(translations?.deleteSuccess || "Item deleted successfully");
      handleClose();
    },
    onError: (error) => {
      toast.error(translations?.deleteError ?? t("deleteError"));
      console.error("Delete error:", error);
    },
  });

  const handleCancel = () => {
    toast.info(translations?.deleteCancelled ?? t("deleteCancelled"));
    handleClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader className="items-center justify-center mb-9">
            <DialogTitle>
              <button
                className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-white"
                onClick={handleClose}
              >
                ✕
              </button>
              <InfoIcon />
            </DialogTitle>
          </DialogHeader>
          <DialogDescription asChild>
            <div>
              <h3 className="text-center !text-2xl mb-9">
                {dialogMessage}
              </h3>
            </div>
          </DialogDescription>
          <DialogFooter className="!items-center !justify-center gap-3">
            {" "}
            <Button
              onClick={() => mutate()}
              loading={isPending}
              className="w-32 h-10"
            >
              {t("delete")} {" "}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
              className="w-32 h-10"
            >
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteButton;
