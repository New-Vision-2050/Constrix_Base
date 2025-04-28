import { Qualification } from "@/modules/user-profile/types/qualification";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";

type PropsT = { qualification: Qualification };

export default function SingleQualificationDataPreview({
  qualification,
}: PropsT) {
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.country_name)}
          label="دولة التخرج"
          value={qualification?.country_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.university_name)}
          label="الجامعة"
          value={qualification?.university_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.academic_qualification_name)}
          label="المؤهل"
          value={qualification?.academic_qualification_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.academic_specialization_name)}
          label="التخصص الأكاديمي"
          value={qualification?.academic_specialization_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.graduation_date)}
          label="تاريخ الحصول على الشهادة"
          value={qualification?.graduation_date}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.study_rate)}
          label="المعدلات الدراسية "
          value={qualification?.study_rate?.toString()}
          type="select"
        />
      </div>

      {Array.isArray(qualification?.files) &&
        qualification?.files?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefreshUserQualifications();
              }}
              valid={Boolean(media?.name)}
              label="ارفاق شهادة"
              value={media?.name ?? "---"}
              type={media?.type == "image" ? "image" : "pdf"}
              fileUrl={media?.url}
            />
          </div>
        ))}
    </div>
  );
}
