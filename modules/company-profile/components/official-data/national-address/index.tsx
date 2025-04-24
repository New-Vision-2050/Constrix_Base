"use client";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import InfoIcon from "@/public/icons/InfoIcon";
import React, { useState } from "react";
import NationalAddressDataPreview from "./national-address-data-preview";
import { Button } from "@/components/ui/button";
import PencilLineIcon from "@/public/icons/pencil-line";
import EyeIcon from "@/public/icons/eye-icon";
import NationalAddressForm from "./national-address-form";
import { CompanyAddress } from "@/modules/company-profile/types/company";

const NationalAddress = ({
  companyAddress,
  id,
}: {
  companyAddress: CompanyAddress;
  id?: string;
}) => {
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="العنوان الوطني"
      valid={
        !!companyAddress &&
        Object.values(companyAddress).every((value) => !!value)
      }
      secondTitle={
        <Button variant={"ghost"} onClick={handleEditClick}>
          {mode === "Preview" ? (
            <PencilLineIcon additionalClass="text-pink-600" />
          ) : (
            <EyeIcon />
          )}
        </Button>
      }
    >
      {mode === "Preview" ? (
        <>
          {!!companyAddress ? (
            <NationalAddressDataPreview companyAddress={companyAddress} />
          ) : (
            <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
              <InfoIcon additionClass="text-orange-500 " />
              <p className="text-center px-5">يجب تحديد عنوان واحد على الاقل</p>
            </div>
          )}
        </>
      ) : (
        <NationalAddressForm companyAddress={companyAddress} id={id} />
      )}
    </FormFieldSet>
  );
};

export default NationalAddress;
