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
import Image from "next/image";

const CompanyLogo = ({ logo }: { logo: string | undefined }) => {
  const [isOpen, handleOpen, handleClose] = useModal();

  return (
    <>
      <div
        onClick={handleOpen}
        className="w-[180px] shrink-0 h-[100px] bg-foreground text-background rounded-md text-center flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      >
        {logo ? (
          <Image src={logo} alt="company-logo" width={180} height={90} />
        ) : (
          <>
            <Camera className="w-6 h-6 text-background mb-2" />
            <span className="text-sm leading-tight">لا يلزم تحميل</span>
            <span className="text-sm leading-tight">لوجو الشركة</span>
          </>
        )}
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
