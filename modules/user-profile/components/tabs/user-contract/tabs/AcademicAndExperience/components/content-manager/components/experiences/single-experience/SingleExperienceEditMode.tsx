import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SingleExperienceFormConfig } from "./SingleExperienceFormConfig";

export default function SingleExperienceEditMode() {
  return (
    <div className="flex flex-col gap-6">
      <FormContent config={SingleExperienceFormConfig()} />
    </div>
  );
}
