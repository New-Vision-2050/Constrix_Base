import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { BorderNumberFormConfig } from "./border-number-form-config";

export default function UserIqamaBorderNumberEditMode() {
  return <FormContent config={BorderNumberFormConfig()} />;
}
