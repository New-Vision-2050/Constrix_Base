"use client";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { CompanyOfficialData } from "./official-data-form-config";
import { officialData } from "@/modules/company-profile/types/company";

const OfficialDataForm = ({
  officialData,
  id,
  handleEditClick,
}: {
  officialData: officialData;
  id?: string;
  handleEditClick?: () => void;
}) => {
  const config = CompanyOfficialData(officialData, id);
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

export default OfficialDataForm;
