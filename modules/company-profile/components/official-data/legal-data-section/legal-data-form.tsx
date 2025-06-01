import React from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { LegalDataFormConfig } from "./legal-data-form-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";

const LegalDataForm = ({
  companyLegalData,
  id,
  handleEditClick
}: {
  companyLegalData: CompanyLegalData[];
  id?: string;
  handleEditClick?: () => void;
}) => {
  const config = LegalDataFormConfig(companyLegalData, id);
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

export default LegalDataForm;
