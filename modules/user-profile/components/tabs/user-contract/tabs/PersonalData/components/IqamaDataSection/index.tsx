import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { BorderNumberFormConfig } from "./config/border-number-form-config";
import { IqamaDataFormConfig } from "./config/iqama-data-config";
import { WorkLicenseFormConfig } from "./config/work-license-form-config";

export default function IqamaDataSection() {
  return (
    <div className="flex flex-col gap-8">
      <FormContent config={BorderNumberFormConfig()} />
      <FormContent config={IqamaDataFormConfig()} />
      <FormContent config={WorkLicenseFormConfig()} />
    </div>
  );
}
