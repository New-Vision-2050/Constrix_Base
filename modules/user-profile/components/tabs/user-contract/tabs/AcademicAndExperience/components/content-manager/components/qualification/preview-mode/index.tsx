import { Qualification } from "@/modules/user-profile/types/qualification";
import PreviewTextField from "../../../../../../components/PreviewTextField";

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
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="الجامعة"
          value={qualification?.university_name}
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="المؤهل"
          value={qualification?.academic_qualification_name}
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="التخصص الأكاديمي"
          value={qualification?.academic_specialization_name}
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="تاريخ الحصول على الشهادة"
          value={qualification?.graduation_date}
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="المعدلات الدراسية "
          value={qualification?.study_rate?.toString()}
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          valid={true}
          label="ارفاق شهادة"
          value="ملف_2024"
          isPdf
        />
      </div>
    </div>
  );
}
