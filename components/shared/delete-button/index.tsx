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
  message = "Are you sure you want to delete this item?",
  onDelete,
  open: externalOpen,
  setOpen: setExternalOpen,
  translations,
}) => {
  const [localOpen, setLocalOpen] = useState(false);

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
      toast.error(translations?.deleteError || "Failed to delete item");
      console.error("Delete error:", error);
    },
  });

  const handleCancel = () => {
    toast.info(translations?.deleteCancelled || "Delete cancelled");
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
                {message ?? "هل انت متاكد تريد الحذف؟"}
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
              حذف{" "}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
              className="w-32 h-10"
            >
              الغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteButton;
