"use client";

import { useModal } from "@/hooks/use-modal";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChangeLogo from "../change-logo";

const CompanyLogo = () => {
  const [isOpen, handleOpen, handleClose] = useModal();

  return (
    <>
      <div
        onClick={handleOpen}
        className="min-w-[180px] bg-foreground text-background rounded-md p-4 text-center flex flex-col items-center justify-center cursor-pointer"
      >
        <Camera className="w-6 h-6 text-background mb-2" />
        <span className="text-sm leading-tight">لا يلزم تحميل</span>
        <span className="text-sm leading-tight">لوجو الشركة</span>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          open ? handleOpen() : handleClose();
        }}
      >
        <DialogContent withCrossButton className="max-w-2xl p-8 gap-10">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center">
              إضافة صورة
            </DialogTitle>
          </DialogHeader>
          <ChangeLogo handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompanyLogo;
