import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { LegalDataFormConfig } from "./legal-data-form-config";

const LegalDataForm = () => {
  const config = LegalDataFormConfig();
  return <FormContent config={config} />;
};

export default LegalDataForm;
