import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { WorkLicenseFormConfig } from "./work-license-form-config";

export default function UserIqamaWorkLicenseDataEditMode() {
  return <FormContent config={WorkLicenseFormConfig()} />;
}
