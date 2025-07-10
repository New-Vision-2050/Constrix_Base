import { Certification } from "@/modules/user-profile/types/Certification";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";

type PropsT = { certification: Certification };
export default function UserCertificationPreview({ certification }: PropsT) {
  const { handleRefetchUserCertifications } = useUserAcademicTabsCxt();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="اسم الجهة"
          value={certification?.professional_bodie_name ?? ""}
          valid={Boolean(certification?.professional_bodie_name)}
          type="select"
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
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ انتهاء الشهادة"
          value={certification?.date_end ?? ""}
          valid={Boolean(certification?.date_end)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          mediaId={certification?.file?.id}
          fireAfterDeleteMedia={() => {
            handleRefetchUserCertifications();
          }}
          valid={Boolean(certification?.file?.name)}
          label="ارفاق الشهادة"
          value={certification?.file?.name ?? "---"}
          type={certification?.file?.type == "image" ? "image" : "pdf"}
          fileUrl={certification?.file?.url}
        />
      </div>
    </div>
  );
}
