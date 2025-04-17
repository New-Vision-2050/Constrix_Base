import SingleExperienceEditMode from "./SingleExperienceEditMode";
import SingleExperiencePreviewMode from "./SingleExperiencePreviewMode";
import { Experience } from "@/modules/user-profile/types/experience";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

type PropsT = { experience: Experience };

export default function SingleExperience({ experience }: PropsT) {
  return (
    <TabTemplate
      title={experience?.job_name ?? ""}
      reviewMode={<SingleExperiencePreviewMode experience={experience} />}
      editMode={<SingleExperienceEditMode experience={experience} />}
    />
  );
}
