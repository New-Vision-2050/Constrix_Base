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
import { Skeleton } from "@/components/ui/skeleton";

const CompanyLogo = ({
  logo,
  isPending,
}: {
  logo: string | undefined;
  isPending: boolean;
}) => {
  const [isOpen, handleOpen, handleClose] = useModal();

  return (
    <>
      <div
        onClick={handleOpen}
        className="w-[180px] shrink-0 h-[100px] text-background rounded-md text-center flex flex-col items-center justify-center cursor-pointer overflow-hidden self-start"
      >
        {isPending ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            {logo ? (
              <Image
                src={logo}
                alt="company-logo"
                width={180}
                height={100}
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-foreground flex flex-col items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-background mb-2" />
                <span className="text-sm leading-tight">لا يلزم تحميل</span>
                <span className="text-sm leading-tight">لوجو الشركة</span>
              </div>
            )}
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
