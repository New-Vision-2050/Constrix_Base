import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/config/axios-config";
import InfoIcon from "@/public/icons/info";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  deleteUrl: string;
  onSuccess?: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  deleteUrl,
  onSuccess,
}) => {
  // Type-safe mutation with React Query
  const mutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiClient.delete(url);
      return response.data;
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      console.log("Error deleting:", error.message);
    },
  });

  const handleDelete = () => {
    if (deleteUrl) {
      mutation.mutate(deleteUrl);
    }
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
            هل انت متاكد تريد الحذف؟
          </h3>
        </DialogDescription>
        <DialogFooter className="!items-center !justify-center gap-3">
          {" "}
          <Button
            onClick={handleDelete}
            loading={mutation.isPending}
            className="w-32 h-10"
          >
            حذف{" "}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
            className="w-32 h-10"
          >
            الغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
