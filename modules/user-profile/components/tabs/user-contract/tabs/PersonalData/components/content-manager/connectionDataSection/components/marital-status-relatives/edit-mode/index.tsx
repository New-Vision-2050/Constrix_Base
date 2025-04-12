import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { MaritalStatusRelativesFormConfig } from "./marital-status-relatives-form-config";

export default function MaritalStatusRelativesSectionEditMode() {
  return <FormContent config={MaritalStatusRelativesFormConfig()} />;
}
