import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ProjectInfoFormConfig } from "./form-config";

export default function ProjectInfoEditMode() {
  return <FormContent config={ProjectInfoFormConfig()} />;
}

