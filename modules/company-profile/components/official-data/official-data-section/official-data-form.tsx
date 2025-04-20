"use client";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { CompanyOfficialData } from "./official-data-form-config";
import { officialData } from "@/modules/company-profile/types/company";

const OfficialDataForm = ({
  officialData,
  id,
}: {
  officialData: officialData;
  id?: string;
}) => {
  const config = CompanyOfficialData(officialData , id);
  return <FormContent config={config} />;
};

export default OfficialDataForm;
