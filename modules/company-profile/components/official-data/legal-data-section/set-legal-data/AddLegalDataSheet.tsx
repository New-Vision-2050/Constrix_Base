"use client";

import React from "react";
import { useLocale } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SetLegalDataForm from ".";


type PropsT ={
    open: boolean
    onOpenChange: (open: boolean) => void
}
function AddLegalDataSheet({open, onOpenChange}: PropsT) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sheetSide = isRtl ? "left" : "right";
  // control open state
  // get Translation 

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={sheetSide}
        className={`h-fit max-h-[100vh] overflow-y-scroll overflow-x-hidden`}
        onInteractOutside={(e) => {
          if (
            e.target &&
            ((e.target as HTMLElement).closest('[role="option"]') ||
              (e.target as HTMLElement).closest("[data-dropdown-id]") ||
              (e.target as HTMLElement).closest(".cmdp-popover"))
          ) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-center my-3">إضافة بيان قانوني</SheetTitle>
        </SheetHeader>

        <SetLegalDataForm onSuccess={() => onOpenChange(false)} />

        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
}

export default AddLegalDataSheet;
