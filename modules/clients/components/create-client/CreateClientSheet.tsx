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
import { useCreateClientCxt } from "../../context/CreateClientCxt";
import { Button } from "@/components/ui/button";
import CreateClientSheetContent from "./CreateClientSheetContent";

const CreateClientSheet = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sheetSide = isRtl ? "left" : "right";
  const t = useTranslations("ClientsModule.form");
  const { openCreateClient, closeCreateClientSheet, openCreateClientSheet } =
    useCreateClientCxt();

  return (
    <>
      <Button onClick={openCreateClientSheet}>{t("addClient")}</Button>
      <Sheet open={openCreateClient} onOpenChange={closeCreateClientSheet}>
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
          <CreateClientSheetContent />
          <SheetFooter />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateClientSheet;
