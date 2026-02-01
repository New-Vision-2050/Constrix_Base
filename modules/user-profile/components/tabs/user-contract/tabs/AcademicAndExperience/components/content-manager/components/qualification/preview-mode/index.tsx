import { Qualification } from "@/modules/user-profile/types/qualification";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { useTranslations } from "next-intl";
type PropsT = { qualification: Qualification };

export default function SingleQualificationDataPreview({
  qualification,
}: PropsT) {
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();
  const t = useTranslations("UserProfile.nestedTabs.qualificationsData");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.country_name)}
          label={t("country")}
          value={qualification?.country_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.university_name)}
          label={t("university")}
          value={qualification?.university_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.academic_qualification_name)}
          label={t("academicQualification")}
          value={qualification?.academic_qualification_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.academic_specialization_name)}
          label={t("academicSpecialization")}
          value={qualification?.academic_specialization_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.graduation_date)}
          label={t("graduationDate")}
          value={qualification?.graduation_date}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.study_rate)}
          label={t("studyRate")}
          value={qualification?.study_rate?.toString()}
          type="select"
        />
      </div>

      {Array.isArray(qualification?.files) &&
      qualification?.files?.length > 0 ? (
        qualification?.files?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefreshUserQualifications();
              }}
              valid={Boolean(media?.name)}
              label={t("attachDocument")}
              value={media?.name ?? "---"}
              type={media?.type == "image" ? "image" : "pdf"}
              fileUrl={media?.url}
            />
          </div>
        ))
      ) : (
        <div className="p-2">
          <PreviewTextField
            valid={false}
            label={t("attachDocument")}
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
