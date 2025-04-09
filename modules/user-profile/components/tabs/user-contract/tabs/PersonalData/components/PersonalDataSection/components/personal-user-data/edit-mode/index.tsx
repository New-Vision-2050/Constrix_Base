import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PersonalDataFormConfig } from "./config/personal-data-form";

export default function UserProfilePersonalDataEditForm() {
  return <FormContent config={PersonalDataFormConfig()} />;
}
