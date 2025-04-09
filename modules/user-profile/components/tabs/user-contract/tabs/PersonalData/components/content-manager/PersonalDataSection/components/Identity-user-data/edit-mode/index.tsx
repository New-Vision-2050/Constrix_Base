import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { IdentityDataFormConfig } from "./config/Identity-data-form";

export default function UserProfileConnectionDataEditForm() {
  return <FormContent config={IdentityDataFormConfig()} />;
}
