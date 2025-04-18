"use client";

import FieldSetSecondTitle from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import InfoIcon from "@/public/icons/InfoIcon";
import { useState } from "react";
import DocsTable from "./docs-table";
import { useModal } from "@/hooks/use-modal";
import { SheetFormBuilder } from "@/modules/form-builder";
import { AddDocFormConfig } from "./add-doc-form-config";

const OfficialDocsSection = () => {
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");
  const [isOpenAddDoc, handleOpenAddDoc, handleCloseAddDoc] = useModal();

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  const dropdownItems = [
    {
      label: "اضافة مستند رسمي",
      onClick: handleOpenAddDoc,
    },
  ];

  return (
    <>
      <FormFieldSet
        title="المستندات الرسمية"
        valid={false}
        secondTitle={
          <FieldSetSecondTitle
            mode={mode}
            handleEditClick={handleEditClick}
            dropdownItems={dropdownItems}
          />
        }
      >
        {mode === "Preview" ? (
          <>
            {true ? (
              <DocsTable />
            ) : (
              <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
                <InfoIcon additionClass="text-orange-500 " />
                <p className="text-center px-5">
                  يجب اضافة مستند رسمي واحد على الاقل
                </p>
              </div>
            )}
          </>
        ) : (
          <div>form</div>
        )}
      </FormFieldSet>
      <SheetFormBuilder
        config={AddDocFormConfig()}
        isOpen={isOpenAddDoc}
        onOpenChange={handleCloseAddDoc}
      />

     
    </>
  );
};

export default OfficialDocsSection;
