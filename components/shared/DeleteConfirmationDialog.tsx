import React, { ReactNode, useState } from "react";
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
import { useTranslations } from "next-intl";


interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  deleteUrl: string;
  onSuccess?: () => void;
  deleteConfirmMessage?: ReactNode;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  deleteUrl,
  onSuccess,
  deleteConfirmMessage
}) => {
  // declare and define error state
  const [errorMsg, setErrorMsg] = useState("");
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
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMsg = error?.response?.data?.message || error.message || 'An error occurred';
      setErrorMsg(errorMsg as string);
    },
  });

  const handleDelete = () => {
    if (deleteUrl) {
      mutation.mutate(deleteUrl);
    }
  };

  const t= useTranslations("FormBuilder.ConfirmationDialog");

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
          <div>
            <h3 className="text-center !text-2xl mb-9">
              {deleteConfirmMessage ?? t("message")}
            </h3>
            {errorMsg && (
              <p className="text-red-500 text-center text-sm mt-2">
                {errorMsg}
              </p>
            )}
          </div>
        </DialogDescription>
        <DialogFooter className="!items-center !justify-center gap-3">
          {" "}
          <Button
            onClick={handleDelete}
            loading={mutation.isPending}
            className="w-32 h-10"
          >
            {t("delete")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
            className="w-32 h-10"
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
