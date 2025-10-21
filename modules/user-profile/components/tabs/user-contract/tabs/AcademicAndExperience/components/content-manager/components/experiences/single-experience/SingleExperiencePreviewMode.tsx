import { Experience } from "@/modules/user-profile/types/experience";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = { experience: Experience };

export default function SingleExperiencePreviewMode({ experience }: PropsT) {
  const t = useTranslations('UserProfile.nestedTabs.academicExperience');
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t('jobName')}
          value={experience?.job_name ?? ""}
          valid={Boolean(experience?.job_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t('startDate')}
          value={experience?.training_from ?? ""}
          valid={Boolean(experience?.training_from)}
          type="date"
        />
      </div>
      
      <div className="p-2">
        <PreviewTextField
          label={t('endDate')}
          value={experience?.training_to ?? ""}
          valid={Boolean(experience?.training_to)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t('companyName')}
          value={experience?.company_name ?? ""}
          valid={Boolean(experience?.company_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t('about')}
          value={experience?.about ?? ""}
          valid={Boolean(experience?.about)}
        />
      </div>
    </div>
  );
}
