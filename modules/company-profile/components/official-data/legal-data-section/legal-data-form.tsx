import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { LegalDataFormConfig } from "./legal-data-form-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";

const LegalDataForm = ({companyLegalData}:{companyLegalData:CompanyLegalData[]}) => {
  const config = LegalDataFormConfig(companyLegalData);
  return <FormContent config={config} />;
};

export default LegalDataForm;
