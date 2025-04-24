"use client";

import FieldSetSecondTitle from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import OfficialDataPreview from "./official-data-preview";
import OfficialDataForm from "./official-data-form";
import { SheetFormBuilder } from "@/modules/form-builder";
import { ReqOfficialDataEdit } from "./req-official-data-edit";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLocale } from "next-intl";
import MyRequests from "./my-requests";
import { Button } from "@/components/ui/button";
import { officialData } from "@/modules/company-profile/types/company";

const OfficialDataSection = ({
  officialData,
  id,
}: {
  officialData: officialData;
  id?: string;
}) => {
  const local = useLocale();
  const isRTL = local === "ar";
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const [isOpenReqForm, handleOpenReqForm, handleCloseReqForm] = useModal();
  const [isOpenMyReq, handleOpenMyReq, handleCloseMyReq] = useModal();

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  const dropdownItems = [
    {
      label: "طلباتي",
      onClick: handleOpenMyReq,
    },
    {
      label: "طلب تعديل البيانات الرسمية",
      onClick: handleOpenReqForm,
    },
  ];
  return (
    <>
      <FormFieldSet
        title="البيانات الرسمية"
        valid={Object.values(officialData).every(value => !!value)}
        secondTitle={
          <FieldSetSecondTitle
            mode={mode}
            handleEditClick={handleEditClick}
            dropdownItems={dropdownItems}
          />
        }
      >
        {mode === "Preview" ? (
          <OfficialDataPreview officialData={officialData} />
        ) : (
          <OfficialDataForm officialData={officialData} id={id}/>
        )}
      </FormFieldSet>
      <SheetFormBuilder
        config={ReqOfficialDataEdit(officialData , id)}
        isOpen={isOpenReqForm}
        onOpenChange={handleCloseReqForm}
      />
      <Sheet open={isOpenMyReq} onOpenChange={handleCloseMyReq}>
        <SheetContent
          side={isRTL ? "left" : "right"}
          className={`h-fit max-h-[100vh] overflow-scroll`}
        >
          <SheetHeader>
            <SheetTitle>طلباتي</SheetTitle>
          </SheetHeader>
          <MyRequests />
          <Button className="mt-6 w-full" onClick={handleCloseMyReq}>
            الرجوع
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default OfficialDataSection;
