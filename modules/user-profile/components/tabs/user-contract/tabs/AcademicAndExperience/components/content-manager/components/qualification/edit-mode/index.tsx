import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { QualificationFormConfig } from "./qualification-config";

export default function SingleQualificationDataEditMode() {
  
  return <FormContent config={QualificationFormConfig()} />;
}
