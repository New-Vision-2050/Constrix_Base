import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PassportDataFormConfig } from "./config/Passport-form-config";

export default function UserProfilePassportDataEditForm() {
  return <FormContent config={PassportDataFormConfig()} />;
}
