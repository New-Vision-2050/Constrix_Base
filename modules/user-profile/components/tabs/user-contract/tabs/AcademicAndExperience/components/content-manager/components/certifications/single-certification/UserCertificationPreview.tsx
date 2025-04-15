import { Certification } from "@/modules/user-profile/types/Certification";
import PreviewTextField from "../../../../../../components/PreviewTextField";

type PropsT = { certification: Certification };
export default function UserCertificationPreview({ certification }: PropsT) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="اسم الجهة"
          value={certification?.professional_bodie_name ?? ""}
          valid={Boolean(certification?.professional_bodie_name)}
          isSelect
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="اسم الاعتماد"
          value={certification?.accreditation_name ?? ""}
          valid={Boolean(certification?.accreditation_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="رقم الاعتماد"
          value={certification?.accreditation_number ?? ""}
          valid={Boolean(certification?.accreditation_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="درجة الاعتماد"
          value={certification?.accreditation_degree ?? ""}
          valid={Boolean(certification?.accreditation_degree)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الحصول على الشهادة"
          value={certification?.date_obtain ?? ""}
          valid={Boolean(certification?.date_obtain)}
          isDate
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ انتهاء الشهادة"
          value={certification?.date_end ?? ""}
          valid={Boolean(certification?.date_end)}
          isDate
        />
      </div>
    </div>
  );
}
