import { Course } from "@/modules/user-profile/types/Course";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = { course: Course };
export default function SingleCoursePreviewMode({ course }: PropsT) {
  const t = useTranslations("AcademicExperience");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("CompanyName")}
          value={course?.company_name}
          valid={Boolean(course?.company_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("Authority")}
          value={course?.authority}
          valid={Boolean(course?.authority)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CourseName")}
          value={course?.name}
          valid={Boolean(course?.name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("AccreditationInstitute")}
          value={course?.institute}
          valid={Boolean(course?.institute)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CertificatesGranted")}
          value={course?.certificate}
          valid={Boolean(course?.certificate)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CertificateAcquisitionDate")}
          value={course?.date_obtain}
          valid={Boolean(course?.date_obtain)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CertificateExpiryDate")}
          value={course?.date_end}
          valid={Boolean(course?.date_end)}
          type="date"
        />
      </div>
    </div>
  );
}
