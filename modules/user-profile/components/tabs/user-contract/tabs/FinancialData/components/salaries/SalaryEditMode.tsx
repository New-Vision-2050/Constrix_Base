import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SalaryFormConfig } from "./SalaryFormConfig";

export default function SalaryEditMode() {
  return <FormContent config={SalaryFormConfig()} />;
}
