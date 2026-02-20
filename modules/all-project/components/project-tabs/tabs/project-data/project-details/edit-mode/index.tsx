import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ProjectDetailsFormConfig } from "./form-config";

export default function ProjectDetailsEditMode() {
  return <FormContent config={ProjectDetailsFormConfig()} />;
}

