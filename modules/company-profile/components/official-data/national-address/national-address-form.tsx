import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { NationalAddressFormConfig } from "./national-address-form-config";
import { CompanyAddress } from "@/modules/company-profile/types/company";

const NationalAddressForm = ({
  companyAddress,
  id,
}: {
  companyAddress: CompanyAddress;
  id?: string;
}) => {
  const config = NationalAddressFormConfig(companyAddress, id);
  return <FormContent config={config} />;
};

export default NationalAddressForm;
