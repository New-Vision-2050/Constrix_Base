import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SingleExperienceFormConfig } from "./SingleExperienceFormConfig";
import { Experience } from "@/modules/user-profile/types/experience";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = { experience: Experience };

export default function SingleExperienceEditMode({ experience }: PropsT) {
  return (
    <div className="flex flex-col gap-6">
      <Can check={[PERMISSIONS.profile.experience.update]}>
        <FormContent config={SingleExperienceFormConfig({ experience })} />
      </Can>
    </div>
  );
}
