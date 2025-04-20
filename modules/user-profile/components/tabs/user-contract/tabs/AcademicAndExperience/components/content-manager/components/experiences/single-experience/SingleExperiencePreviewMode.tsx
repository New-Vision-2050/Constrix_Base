import { Experience } from "@/modules/user-profile/types/experience";
import PreviewTextField from "../../../../../../components/PreviewTextField";

type PropsT = { experience: Experience };

export default function SingleExperiencePreviewMode({ experience }: PropsT) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="المسمى الوظيفي"
          value={experience?.job_name ?? ""}
          valid={Boolean(experience?.job_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="حدد فترة التدريب"
          value={experience?.training_from + " - " + experience?.training_to}
          valid={Boolean(experience?.training_from) && Boolean(experience?.training_to)}
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="اسم الشركة"
          value={experience?.company_name ?? ""}
          valid={Boolean(experience?.company_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="نبذه عن المشاريع والاعمال"
          value={experience?.about ?? ""}
          valid={Boolean(experience?.about)}
        />
      </div>
    </div>
  );
}
