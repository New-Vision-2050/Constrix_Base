"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCreateBrokerCxt } from "../../context/CreateBrokerCxt";
import { Button } from "@/components/ui/button";
import CreateBrokerSheetContent from "./CreateBrokerSheetContent";

const CreateBrokerSheet = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sheetSide = isRtl ? "left" : "right";
  const t = useTranslations("BrokersModule.form");
  const { openCreateBroker, closeCreateBrokerSheet, openCreateBrokerSheet } =
    useCreateBrokerCxt();

  return (
    <>
      <Button onClick={openCreateBrokerSheet}>{t("addBroker")}</Button>
      <Sheet open={openCreateBroker} onOpenChange={closeCreateBrokerSheet}>
        <SheetContent
          side={sheetSide}
          className={`h-fit max-h-[100vh] overflow-visible`}
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
            <SheetTitle className="text-xl font-semibold text-center">
              {t("title")}
            </SheetTitle>
          </SheetHeader>
          <CreateBrokerSheetContent />
          <SheetFooter />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateBrokerSheet;
