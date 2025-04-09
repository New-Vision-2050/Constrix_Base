import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ConnectionDataFormConfig } from "./config/connection-data-form";

export default function UserProfileConnectionDataEditForm() {
  return <FormContent config={ConnectionDataFormConfig()} />;
}
