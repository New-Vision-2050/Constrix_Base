"use client";

import FieldSetSecondTitle from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import React, { useState } from "react";
import OfficialDataPreview from "./official-data-preview";
import OfficialDataForm from "./official-data-form";
import InfoIcon from "@/public/icons/InfoIcon";
import SupportData from "./support-data";
import { useModal } from "@/hooks/use-modal";
import { SheetFormBuilder } from "@/modules/form-builder";
import { ReqOfficialDataEdit } from "./req-official-data-edit";

const OfficialData = () => {
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const [isOpenReq, handleOpenReq, handleCloseReq] = useModal();

  console.log({ isOpenReq });

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  const dropdownItems = [
    {
      label: "طلباتي",
      onClick: () => null,
    },
    {
      label: "طلب تعديل البيانات الرسمية",
      onClick: handleOpenReq,
    },
  ];

  return (
    <div className="bg-sidebar p-5 rounded-md space-y-5">
      <FormFieldSet
        title="البيانات الرسمية"
        valid={false}
        secondTitle={
          <FieldSetSecondTitle
            mode={mode}
            handleEditClick={handleEditClick}
            dropdownItems={dropdownItems}
          />
        }
      >
        {mode === "Preview" ? <OfficialDataPreview /> : <OfficialDataForm />}
      </FormFieldSet>

      <SheetFormBuilder
        config={ReqOfficialDataEdit()}
        isOpen={isOpenReq}
        onOpenChange={handleCloseReq}
      />

      <FormFieldSet
        title="البيانات القانونية"
        valid={false}
        secondTitle={
          <FieldSetSecondTitle mode={"Preview"} handleEditClick={() => null} />
        }
      >
        {mode === "Preview" ? (
          <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
            <InfoIcon additionClass="text-orange-500 " />
            <p className="text-center px-5">يجب إكمال بيانات التسجيل</p>
          </div>
        ) : (
          <></>
        )}
      </FormFieldSet>

      <SupportData />

      <FormFieldSet
        title="العنوان الوطني"
        valid={false}
        secondTitle={
          <FieldSetSecondTitle mode={"Preview"} handleEditClick={() => null} />
        }
      >
        {mode === "Preview" ? (
          <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
            <InfoIcon additionClass="text-orange-500 " />
            <p className="text-center px-5">يجب تحديد عنوان واحد على الاقل</p>
          </div>
        ) : (
          <></>
        )}
      </FormFieldSet>

      <FormFieldSet
        title="المستندات الرسمية"
        valid={false}
        secondTitle={
          <FieldSetSecondTitle mode={"Preview"} handleEditClick={() => null} />
        }
      >
        {mode === "Preview" ? (
          <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
            <InfoIcon additionClass="text-orange-500 " />
            <p className="text-center px-5">
              يجب اضافة مستند رسمي واحد على الاقل
            </p>
          </div>
        ) : (
          <></>
        )}
      </FormFieldSet>
    </div>
  );
};

export default OfficialData;
