"use client";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { CompanyOfficialData } from "./official-data-form-config";

const OfficialDataForm = () => {
  const config = CompanyOfficialData();
  return <FormContent config={config} />;
};

export default OfficialDataForm;
