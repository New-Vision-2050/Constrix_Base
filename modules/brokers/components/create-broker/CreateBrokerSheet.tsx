"use client";

import React, {useEffect} from "react";
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

const CreateBrokerSheet = ({
  sub_entity_id,
  handleRefreshWidgetsData,
}: {
  handleRefreshWidgetsData?: () => void;
  sub_entity_id?: string;
}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sheetSide = isRtl ? "left" : "right";
  const t = useTranslations("BrokersModule.form");
  const { openCreateBroker, closeCreateBrokerSheet, openCreateBrokerSheet } =
    useCreateBrokerCxt();

  // Listen for force open events
  useEffect(() => {
    const handleForceOpen = () => {
      openCreateBrokerSheet();
    };

    const handleForceOpen2 = () => {
      openCreateBrokerSheet();
    };

    window.addEventListener('force-open-broker-form', handleForceOpen);
    window.addEventListener('open-broker-now', handleForceOpen2);
    
    return () => {
      window.removeEventListener('force-open-broker-form', handleForceOpen);
      window.removeEventListener('open-broker-now', handleForceOpen2);
    };
  }, [openCreateBrokerSheet]);

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
          <CreateBrokerSheetContent sub_entity_id={sub_entity_id} handleRefreshWidgetsData={handleRefreshWidgetsData} />
          <SheetFooter />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CreateBrokerSheet;
