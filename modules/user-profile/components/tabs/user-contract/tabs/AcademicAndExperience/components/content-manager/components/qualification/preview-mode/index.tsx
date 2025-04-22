import { Qualification } from "@/modules/user-profile/types/qualification";
import PreviewTextField from "../../../../../../components/previewTextField";

type PropsT = { qualification: Qualification };

export default function SingleQualificationDataPreview({
  qualification,
}: PropsT) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="دولة التخرج"
          value={qualification?.country_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="الجامعة"
          value={qualification?.university_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="المؤهل"
          value={qualification?.academic_qualification_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="التخصص الأكاديمي"
          value={qualification?.academic_specialization_name}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الحصول على الشهادة"
          value={qualification?.graduation_date}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="المعدلات الدراسية "
          value={qualification?.study_rate?.toString()}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={Boolean(qualification?.files?.[0]?.url)}
          label="ارفاق شهادة"
          value="ملف"
          type="pdf"
          fileUrl={qualification?.files?.[0]?.url??''}
        />
      </div>
    </div>
  );
}
