"use client";

import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import InfoIcon from "@/public/icons/InfoIcon";
import { useState } from "react";
import DocsTable from "./docs-table";
import { useModal } from "@/hooks/use-modal";
import { SheetFormBuilder } from "@/modules/form-builder";
import { AddDocFormConfig } from "./add-doc-form-config";
import { CompanyDocument } from "@/modules/company-profile/types/company";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SettingsIcon from "@/public/icons/settings";
import { useLocale } from "next-intl";

const OfficialDocsSection = ({
  companyOfficialDocuments,
  id,
}: {
  companyOfficialDocuments: CompanyDocument[];
  id?: string;
}) => {
  console.log({ companyOfficialDocuments });
  const locale = useLocale();
  const isRTL = locale === "ar";

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
          <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <SettingsIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {dropdownItems.map((item, index) => (
                <DropdownMenuItem key={index} onClick={() => item.onClick()}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {mode === "Preview" ? (
          <>
            {!!companyOfficialDocuments &&
            companyOfficialDocuments.length > 0 ? (
              <DocsTable
                companyOfficialDocuments={companyOfficialDocuments}
                id={id}
              />
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
        config={AddDocFormConfig(id)}
        isOpen={isOpenAddDoc}
        onOpenChange={handleCloseAddDoc}
      />
    </>
  );
};

export default OfficialDocsSection;
