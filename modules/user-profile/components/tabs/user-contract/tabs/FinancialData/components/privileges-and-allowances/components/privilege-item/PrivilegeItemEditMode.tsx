import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PrivilegeItemFormConfig } from "./PrivilegeItemFormConfig";

export default function PrivilegeItemEditMode() {
  return <FormContent config={PrivilegeItemFormConfig()} />;
}
