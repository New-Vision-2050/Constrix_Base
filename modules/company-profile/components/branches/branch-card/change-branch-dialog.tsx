import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import InfoIcon from "@/public/icons/info";
import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { changeBranchForm } from "./change-branch-form-config";
import { Branch } from "@/modules/company-profile/types/company";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";

const ChangeBranchDialog = ({
  branchId,
  branches,
}: {
  branchId: string;
  branches: Branch[];
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await apiClient.post(
        `management_hierarchies/make-branch-main/${branchId}`
      ),
  });
  const [isOpen, handleOpen, handleClose] = useModal();

  const handleSubmit = () => {
    const isThereAnotherMainBranch = branches.filter(
      (branch) => branch.parent_id === null
    );

    if (isThereAnotherMainBranch.length > 1) {
      mutate(undefined, {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ["main-company-data"],
          });
        },
      });
    } else {
      handleOpen();
    }
  };

  return (
    <>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleOpen} loading={isPending}>
          تغيير الفرع
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent withCrossButton>
          <DialogHeader className="gap-3 items-center">
            <InfoIcon />
            <DialogTitle className="text-center my-5">
              لا يمكن تغيير الفرع الا عند اختيار فرع رئيسي اخر{" "}
            </DialogTitle>
          </DialogHeader>
          <FormContent config={changeBranchForm(branchId, branches)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeBranchDialog;
