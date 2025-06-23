import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { NationalAddressFormConfig } from "./national-address-form-config";
import { CompanyAddress } from "@/modules/company-profile/types/company";

const NationalAddressForm = ({
  companyAddress,
  id,
  handleEditClick,
}: {
  companyAddress: CompanyAddress;
  id?: string;
  handleEditClick?: () => void;
}) => {
  const config = NationalAddressFormConfig(companyAddress, id);
  return (
    <FormContent
      config={{
        ...config,
        onSuccess: (values, result) => {
          if (typeof config.onSuccess === "function") {
            config.onSuccess(values, result);
          }
          handleEditClick?.();
        },
      }}
    />
  );
};

export default NationalAddressForm;
