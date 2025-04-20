import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ConnectionInformationFormConfig } from "./connection-info-form-config";

export default function MainUserConnectionInfoSectionEdit() {
  return <FormContent config={ConnectionInformationFormConfig()} />;
}
