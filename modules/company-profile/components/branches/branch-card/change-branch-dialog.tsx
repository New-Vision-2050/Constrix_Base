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

const ChangeBranchDialog = () => {
  const [isOpen, handleOpen, handleClose] = useModal();
  return (
    <>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleOpen}>تغيير الفرع</Button>
      </div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent withCrossButton>
          <DialogHeader className="gap-3 items-center">
            <InfoIcon />
            <DialogTitle className="text-center my-5">
              لا يمكن تغيير الفرع الا عند اختيار فرع رئيسي اخر{" "}
            </DialogTitle>
          </DialogHeader>
          <FormContent config={changeBranchForm()}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeBranchDialog;
