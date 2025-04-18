import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { NationalAddressFormConfig } from "./national-address-form-config";

const NationalAddressForm = () => {
  const config = NationalAddressFormConfig();
  return <FormContent config={config} />;
};

export default NationalAddressForm;
