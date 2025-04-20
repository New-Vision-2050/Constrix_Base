import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { NationalAddressFormConfig } from "./national-address-form-config";
import { CompanyAddress } from "@/modules/company-profile/types/company";

const NationalAddressForm = ({companyAddress}:{companyAddress:CompanyAddress}) => {
  const config = NationalAddressFormConfig(companyAddress);
  return <FormContent config={config} />;
};

export default NationalAddressForm;
