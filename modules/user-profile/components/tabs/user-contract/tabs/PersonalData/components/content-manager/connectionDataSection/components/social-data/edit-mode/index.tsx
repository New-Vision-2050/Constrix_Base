import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SocialMediaSitesFormConfig } from "./social-form-config";

export default function SocialDataSectionEditMode() {
  return <FormContent config={SocialMediaSitesFormConfig()} />;
}
