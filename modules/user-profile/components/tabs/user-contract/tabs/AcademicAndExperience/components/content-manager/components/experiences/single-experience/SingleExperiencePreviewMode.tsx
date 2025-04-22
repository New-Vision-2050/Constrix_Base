import { Experience } from "@/modules/user-profile/types/experience";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = { experience: Experience };

export default function SingleExperiencePreviewMode({ experience }: PropsT) {
  const t = useTranslations("AcademicExperience");
  const tCompanyUser = useTranslations("CompanyUserForm");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={tCompanyUser("JobTitle")}
          value={experience?.job_name ?? ""}
          valid={Boolean(experience?.job_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("SpecifyTrainingPeriod")}
          value={experience?.training_from + " - " + experience?.training_to}
          valid={Boolean(experience?.training_from) && Boolean(experience?.training_to)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CompanyName")}
          value={experience?.company_name ?? ""}
          valid={Boolean(experience?.company_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("BriefAboutProjects")}
          value={experience?.about ?? ""}
          valid={Boolean(experience?.about)}
        />
      </div>
    </div>
  );
}
