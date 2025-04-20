"use client";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { CompanyOfficialData } from "./official-data-form-config";
import { officialData } from "@/modules/company-profile/types/company";

const OfficialDataForm = ({ officialData }: { officialData: officialData }) => {
  const config = CompanyOfficialData(officialData);
  return <FormContent config={config} />;
};

export default OfficialDataForm;
