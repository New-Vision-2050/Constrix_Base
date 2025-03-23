"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InfoIcon from "@/public/icons/info";
import { Button } from "../ui/button";

import { useTranslations } from "next-intl";

const ErrorDialog = () => {
  const { isOpen, desc, closeDialog } = useErrorDialogStore();

const ErrorDialog = ({ isOpen, handleClose, desc }: IErrorDialog) => {
  const t = useTranslations();
  
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-80 w-full rounded-2xl p-10 flex flex-col">
        <DialogHeader>
          <DialogTitle className="mx-auto">
            <InfoIcon />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription
          asChild
          className="text-2xl text-white font-bold text-center mb-6"
        >
          <p>{desc}</p>
        </DialogDescription>
        <DialogFooter>
          <Button
            type="button"
            color="primary"
            onClick={closeDialog}
            className="w-full"
          >
            {t("Errors.Back")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
