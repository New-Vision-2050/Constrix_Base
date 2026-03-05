import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ProjectStatusFormConfig } from "./form-config";

export default function ProjectStatusEditMode() {
  return <FormContent config={ProjectStatusFormConfig()} />;
}

