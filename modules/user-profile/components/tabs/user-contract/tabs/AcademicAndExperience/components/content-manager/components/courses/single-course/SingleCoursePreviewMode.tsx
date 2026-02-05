import { Course } from "@/modules/user-profile/types/Course";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import {useTranslations} from "next-intl";

type PropsT = { course: Course };
export default function SingleCoursePreviewMode({ course }: PropsT) {

    const t = useTranslations("UserProfile.tabs.contractTabs.experience");
  const { handleRefetchUserCourses } = useUserAcademicTabsCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("companyName")}
          value={course?.company_name}
          valid={Boolean(course?.company_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("entity")}
          value={course?.authority}
          valid={Boolean(course?.authority)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("courseName")}
          value={course?.name}
          valid={Boolean(course?.name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("accreditationBody")}
          value={course?.institute}
          valid={Boolean(course?.institute)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("awardedCertificates")}
          value={course?.certificate}
          valid={Boolean(course?.certificate)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("dateOfObtainingCertificate")}
          value={course?.date_obtain}
          valid={Boolean(course?.date_obtain)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("certificateExpirationDate")}
          value={course?.date_end}
          valid={Boolean(course?.date_end)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          mediaId={course?.file?.id}
          fireAfterDeleteMedia={() => {
            handleRefetchUserCourses();
          }}
          valid={Boolean(course?.file?.name)}
          label={t("certificate")}
          value={course?.file?.name ?? "---"}
          type={course?.file?.type == "image" ? "image" : "pdf"}
          fileUrl={course?.file?.url}
        />
      </div>
    </div>
  );
}
