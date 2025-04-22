import { Qualification } from "@/modules/user-profile/types/qualification";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = { qualification: Qualification };

export default function SingleQualificationDataPreview({
  qualification,
}: PropsT) {
  const t = useTranslations("AcademicExperience");
  const tGeneral = useTranslations("GeneralActions");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.country_name)}
          label={t("GraduationCountry")}
          value={qualification?.country_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.university_name)}
          label={t("University")}
          value={qualification?.university_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.academic_qualification_name)}
          label={t("Qualification")}
          value={qualification?.academic_qualification_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.academic_specialization_name)}
          label={t("AcademicSpecialization")}
          value={qualification?.academic_specialization_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.graduation_date)}
          label={t("CertificateAcquisitionDate")}
          value={qualification?.graduation_date}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.study_rate)}
          label={t("StudyGrades")}
          value={qualification?.study_rate?.toString()}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.files?.[0]?.url)}
          label={t("AttachCertificate")}
          value={tGeneral("File")}
          type="pdf"
          fileUrl={qualification?.files?.[0]?.url ?? ""}
        />
      </div>
    </div>
  );
}
