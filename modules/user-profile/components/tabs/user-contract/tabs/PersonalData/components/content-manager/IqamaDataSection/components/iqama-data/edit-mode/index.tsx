import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { IqamaDataFormConfig } from "./iqama-data-config";

export default function UserIqamaDataEditMode() {
  return <FormContent config={IqamaDataFormConfig()} />;
}
