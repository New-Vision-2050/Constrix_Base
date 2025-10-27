import React, { useState, ReactNode } from "react";

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
import InfoIcon from "@/public/icons/InfoIcon";

type DeleteButtonProps = {
  render?: ({ onOpen }: { onOpen: VoidFunction }) => ReactNode;
  message?: string;
  onDelete: ({ onClose }: { onClose: VoidFunction }) => void | Promise<void>;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({
  render,
  message = "Are you sure you want to delete this item?",
  onDelete,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      await onDelete({ onClose: handleClose });
      handleClose();
    },
  });

  return (
    <>
      {render ? (
        render({ onOpen: handleOpen })
      ) : (
        <Button variant="destructive" onClick={handleOpen}>
          Delete
        </Button>
      )}
      <Dialog open={open} onOpenChange={handleClose}>
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
              onClick={handleClose}
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
