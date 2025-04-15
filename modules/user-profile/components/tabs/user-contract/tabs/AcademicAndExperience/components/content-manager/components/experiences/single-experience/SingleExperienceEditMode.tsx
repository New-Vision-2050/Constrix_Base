import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SingleExperienceFormConfig } from "./SingleExperienceFormConfig";
import { Experience } from "@/modules/user-profile/types/experience";

type PropsT = { experience: Experience };

export default function SingleExperienceEditMode({ experience }: PropsT) {
  return (
    <div className="flex flex-col gap-6">
      <FormContent config={SingleExperienceFormConfig({ experience })} />
    </div>
  );
}
